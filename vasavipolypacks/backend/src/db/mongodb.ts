import { MongoClient, Db, Collection } from 'mongodb';
import crypto from 'crypto';

export class MongoModel {
  private collectionName: string;
  private dbProvider: () => Db;

  constructor(collectionName: string, dbProvider: () => Db) {
    this.collectionName = collectionName;
    this.dbProvider = dbProvider;
  }

  private get col(): Collection {
    return this.dbProvider().collection(this.collectionName);
  }

  private async mapFilter(where: any): Promise<any> {
    if (!where) return {};
    const filter: any = {};
    const db = this.dbProvider();
    for (const [key, value] of Object.entries(where)) {
      if (key === 'id') {
        if (typeof value === 'object' && value !== null && 'in' in value) {
          filter['_id'] = { $in: (value as any).in };
        } else {
          filter['_id'] = value;
        }
      } else if (key === 'NOT') {
        if (value && typeof value === 'object') {
          for (const [notKey, notVal] of Object.entries(value)) {
            const mappedNotKey = notKey === 'id' ? '_id' : notKey;
            filter[mappedNotKey] = { $ne: notVal };
          }
        }
      } else if (key === 'quote' && typeof value === 'object' && value !== null) {
        const quoteFilter: any = {};
        for (const [qKey, qVal] of Object.entries(value)) {
          quoteFilter[qKey === 'id' ? '_id' : qKey] = qVal;
        }
        const matchingQuotes = await db.collection('quote').find(quoteFilter).toArray();
        const quoteIds = matchingQuotes.map(q => q._id);
        filter['quoteId'] = { $in: quoteIds };
      } else if (typeof value === 'object' && value !== null && 'in' in value) {
        filter[key] = { $in: (value as any).in };
      } else {
        filter[key] = value;
      }
    }
    return filter;
  }

  private mapDoc(doc: any): any {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { id: _id, ...rest };
  }

  private applySelect(doc: any, select: any): any {
    if (!doc || !select) return doc;
    const result: any = {};
    for (const key of Object.keys(select)) {
      if (select[key]) {
        result[key] = doc[key];
      }
    }
    return result;
  }

  async findUnique(args: { where: any; include?: any; select?: any }): Promise<any> {
    const filter = await this.mapFilter(args.where);
    const doc = await this.col.findOne(filter);
    if (!doc) return null;
    let result = this.mapDoc(doc);
    if (args.include) {
      result = await this.applyIncludes(result, args.include);
    }
    if (args.select) {
      result = this.applySelect(result, args.select);
    }
    return result;
  }

  async findFirst(args: { where?: any; orderBy?: any; include?: any; select?: any }): Promise<any> {
    const filter = await this.mapFilter(args.where);
    let cursor = this.col.find(filter);
    if (args.orderBy) {
      cursor = cursor.sort(this.mapOrderBy(args.orderBy));
    }
    const doc = await cursor.limit(1).next();
    if (!doc) return null;
    let result = this.mapDoc(doc);
    if (args.include) {
      result = await this.applyIncludes(result, args.include);
    }
    if (args.select) {
      result = this.applySelect(result, args.select);
    }
    return result;
  }

  async findMany(args?: { where?: any; orderBy?: any; include?: any; select?: any; take?: number; skip?: number }): Promise<any[]> {
    const filter = await this.mapFilter(args?.where);
    let cursor = this.col.find(filter);
    if (args?.orderBy) {
      cursor = cursor.sort(this.mapOrderBy(args.orderBy));
    }
    if (args?.skip) {
      cursor = cursor.skip(args.skip);
    }
    if (args?.take) {
      cursor = cursor.limit(args.take);
    }
    const docs = await cursor.toArray();
    let results = docs.map(d => this.mapDoc(d));
    if (args?.include) {
      results = await Promise.all(results.map(r => this.applyIncludes(r, args.include)));
    }
    if (args?.select) {
      results = results.map(r => this.applySelect(r, args.select));
    }
    return results;
  }

  async create(args: { data: any }): Promise<any> {
    const data = { ...args.data };
    if (!data.id) {
      data._id = crypto.randomUUID();
    } else {
      data._id = data.id;
      delete data.id;
    }
    if (!data.createdAt) data.createdAt = new Date();
    if (!data.updatedAt) data.updatedAt = new Date();

    await this.col.insertOne(data);
    return this.mapDoc(data);
  }

  async update(args: { where: any; data: any }): Promise<any> {
    const filter = await this.mapFilter(args.where);
    const updateData = { ...args.data };
    delete updateData.id;
    delete updateData._id;
    updateData.updatedAt = new Date();

    const res = await this.col.findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: 'after' }
    );
    const doc = res && ((res as any).value || res);
    return this.mapDoc(doc);
  }

  async delete(args: { where: any }): Promise<any> {
    const filter = await this.mapFilter(args.where);
    const doc = await this.col.findOne(filter);
    if (!doc) return null;
    await this.col.deleteOne(filter);
    return this.mapDoc(doc);
  }

  async deleteMany(args?: { where?: any }): Promise<{ count: number }> {
    const filter = await this.mapFilter(args?.where);
    const res = await this.col.deleteMany(filter);
    return { count: res.deletedCount };
  }

  async count(args?: { where?: any }): Promise<number> {
    const filter = await this.mapFilter(args?.where);
    return await this.col.countDocuments(filter);
  }

  async aggregate(args: { _avg?: any; _sum?: any }): Promise<any> {
    const docs = await this.col.find({}).toArray();
    let totalMin = 0;
    let totalMax = 0;
    let totalQty = 0;
    const count = docs.length;

    for (const d of docs) {
      totalMin += Number(d.estimatedMinPrice) || 0;
      totalMax += Number(d.estimatedMaxPrice) || 0;
      totalQty += Number(d.quantity) || 0;
    }

    return {
      _avg: {
        estimatedMinPrice: count > 0 ? totalMin / count : 0,
        estimatedMaxPrice: count > 0 ? totalMax / count : 0
      },
      _sum: {
        quantity: totalQty
      }
    };
  }

  private mapOrderBy(orderBy: any): any {
    if (!orderBy) return {};
    const sort: any = {};
    if (Array.isArray(orderBy)) {
      orderBy.forEach(item => {
        for (const [key, val] of Object.entries(item)) {
          sort[key] = val === 'desc' ? -1 : 1;
        }
      });
    } else {
      for (const [key, val] of Object.entries(orderBy)) {
        sort[key] = val === 'desc' ? -1 : 1;
      }
    }
    return sort;
  }

  private async applyIncludes(doc: any, include: any): Promise<any> {
    const db = this.dbProvider();
    const result = { ...doc };
    for (const [relation, value] of Object.entries(include)) {
      if (!value) continue;
      if (relation === 'bagConfig' && doc.bagConfigId) {
        const bagConfigDoc = await db.collection('bagConfig').findOne({ _id: doc.bagConfigId });
        result.bagConfig = bagConfigDoc ? this.mapDoc(bagConfigDoc) : null;
      }
      else if (relation === 'quote' && doc.quoteId) {
        const quoteDoc = await db.collection('quote').findOne({ _id: doc.quoteId });
        result.quote = quoteDoc ? this.mapDoc(quoteDoc) : null;
      }
      else if (relation === 'user' && doc.userId) {
        const userDoc = await db.collection('user').findOne({ _id: doc.userId });
        result.user = userDoc ? this.mapDoc(userDoc) : null;
      }
      else if (relation === 'configs') {
        const configs = await db.collection('bagConfig').find({ userId: doc.id }).toArray();
        result.configs = configs.map(c => this.mapDoc(c));
      }
      else if (relation === 'quotes') {
        const quotes = await db.collection('quote').find({ userId: doc.id }).toArray();
        result.quotes = quotes.map(q => this.mapDoc(q));
      }
      else if (relation === 'orders') {
        const orders = await db.collection('order').find({ quoteId: doc.id }).toArray();
        result.orders = orders.map(o => this.mapDoc(o));
      }
    }
    return result;
  }
}

export class PrismaClient {
  private client: MongoClient;
  private dbInstance!: Db;

  user: MongoModel;
  bagConfig: MongoModel;
  quote: MongoModel;
  lead: MongoModel;
  order: MongoModel;

  constructor() {
    const url = process.env.DATABASE_URL || "mongodb://localhost:27017/vasavipolypacks";
    this.client = new MongoClient(url);

    const dbProvider = () => {
      if (!this.dbInstance) {
        this.dbInstance = this.client.db(this.client.options.dbName || "vasavipolypacks");
      }
      return this.dbInstance;
    };

    this.user = new MongoModel('user', dbProvider);
    this.bagConfig = new MongoModel('bagConfig', dbProvider);
    this.quote = new MongoModel('quote', dbProvider);
    this.lead = new MongoModel('lead', dbProvider);
    this.order = new MongoModel('order', dbProvider);
  }

  async $connect(): Promise<void> {
    await this.client.connect();
    this.dbInstance = this.client.db(this.client.options.dbName || "vasavipolypacks");
  }

  async $disconnect(): Promise<void> {
    await this.client.close();
  }
}
