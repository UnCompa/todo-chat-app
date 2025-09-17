type Pagination = {
  page: number;
  limit: number;
  total: number;
};

export class ResponseBuilder {
  private statusCode: number = 200;
  private message: string = 'Operación exitosa';
  private data: any = null;
  private pagination?: Pagination;

  public setStatus(code: number): this {
    this.statusCode = code;
    return this;
  }

  public setMessage(msg: string): this {
    this.message = msg;
    return this;
  }

  public setData(data: any): this {
    this.data = data;
    return this;
  }

  public setPagination(pagination: Pagination): this {
    this.pagination = {
      ...pagination,
    };
    return this;
  }

  public build(): Record<string, any> {
    const response: Record<string, any> = {
      statusCode: this.statusCode,
      message: this.message,
    };

    if (this.data !== undefined) response.data = this.data;

    if (this.pagination) {
      response.pagination = {
        ...this.pagination,
        pages: Math.ceil(this.pagination.total / this.pagination.limit),
      };
    }

    return response;
  }
}
