# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index
  - GET /products
  - Returns a list of all products
- Show
  - GET /products/:id
  - Returns a single product
- Create [token required]
  - POST /products
  - Creates a new product
  - Body: { name, price}

#### Users

- Index [token required]
  - GET /users
  - Returns a list of all users
- Show [token required]
  - GET /users/:id
  - Returns a single user
- Create N[token required]
  - POST /users
  - Creates a new user
  - Body: { firstName, lastName, password }
- Login [token required]
  - POST /users/login
  - Logs in a user
  - Body: { id, password }

#### Orders

- Current Order by user (args: user id)[token required]
  - GET /users/:id/orders
  - Returns a all orders for a user along with products in the order

## Data Shapes

#### Product

- id (integer primary key autoincrement)
- name (string)
- price (integer)

#### User

- id (integer primary key autoincrement)
- firstName (string)
- lastName (string)
- password digest (string)

#### Orders

- id (integer primary key autoincrement)
- quantity of each product in the order (integer)
- user_id (integer foreign key)
- is active (boolean)

### Order Products

- id (integer primary key autoincrement)
- order_id (integer foreign key)
- product_id (integer foreign key)
- quantity (integer)
