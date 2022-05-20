export class ProductCategory {
  private _id: number | undefined;
  private _categoryName: string | undefined;


  get id(): number | undefined {
    return this._id;
  }

  set id(value: number | undefined) {
    this._id = value;
  }

  get categoryName(): string | undefined {
    return this._categoryName;
  }

  set categoryName(value: string | undefined) {
    this._categoryName = value;
  }
}
