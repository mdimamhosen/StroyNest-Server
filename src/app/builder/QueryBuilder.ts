import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }
  // search query
  searchTerm(searchableFields: string[]) {
    if (this?.query?.searchTerm) {
      const searchTerm = this.query.searchTerm as string;
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(field => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
      });
    }
    return this;
  }
  // filter query
  filter() {
    const queryObject = { ...this.query };

    const skipedFields = [
      'limit',
      'page',
      'searchTerm',
      'sort',
      'select',
      'fields',
    ];

    skipedFields.forEach(field => {
      if (queryObject[field]) {
        delete queryObject[field];
      }
    });

    this.modelQuery = this.modelQuery.find(queryObject as FilterQuery<T>);
    return this;
  }

  // sort query
  sort() {
    let sort = '-createdAt';

    if (this.query?.sort) {
      sort = (this.query.sort as string).split(',').join(' ');
    }

    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  // pagination query

  pagination() {
    let page = 1;
    let skip = 0;
    let limit = 12;

    if (this.query?.limit) {
      limit = parseInt(this.query.limit as string, 10);
    }

    if (this.query?.page) {
      page = parseInt(this.query.page as string, 10);
      skip = (page - 1) * limit;
    }

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // field selection query
  fields() {
    const fields = this.query?.fields
      ? (this.query.fields as string).split(',').join(' ')
      : '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const filter = this.modelQuery.getFilter();

    const total = await this.modelQuery.model.countDocuments(filter);

    let page = 1;

    let limit = 12;

    if (this.query?.limit) {
      limit = parseInt(this.query.limit as string, 10);
    }

    if (this.query?.page) {
      page = parseInt(this.query.page as string, 10);
    }

    const totalPage = Math.ceil(total / limit);

    return {
      total,
      page,
      limit,
      totalPage,
    };
  }
}

export default QueryBuilder;
