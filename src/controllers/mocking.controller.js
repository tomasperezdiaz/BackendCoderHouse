import { fakerEN_US as faker } from "@faker-js/faker";

export class MockingController {
  static generateProducts = (req, res) => {
    try {
      let products = [];
      for (let i = 0; i <= 100; i++) {
        products.push({
          _id: faker.database.mongodbObjectId(),
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          code: faker.string.alphanumeric(8),
          price: faker.commerce.price({ min: 100, max: 1000 }),
          status: true,
          stock: faker.number.int({ min: 50, max: 1000 }),
          category: faker.commerce.productAdjective(),
          thumbnails: [faker.image.url()],
        });
      }
      res.json(products);
    } catch (error) {
      res.status(400).json({ error: `${error.message}` });
    }
  };
}