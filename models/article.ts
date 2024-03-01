export class Article {
  category: string
  name: string
  link: string

  constructor(
    category: string,
    name: string,
    link: string,
  ) {
    this.category = category;
    this.name = name;
    this.link = link
  }
}
