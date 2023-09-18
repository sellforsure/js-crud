// Підключаємо технологію express для back-end сервера
const e = require('express')
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list: User.getList(),
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений',
  })
})

// ================================================================

class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 10000)
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  static add = (product) => {
    this.#list.push(product)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const productIndex = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (productIndex !== -1) {
      if (data.name)
        this.#list[productIndex].name = data.name
      if (data.price)
        this.#list[productIndex].price = data.price
      if (data.description)
        this.#list[productIndex].description =
          data.description
    }
  }
}

// ================================================================

router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    info: 'Успішне виконання дії',
  })
})

router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',
    data: {
      products: {
        list: Product.getList(),
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/product-edit', function (req, res) {
  const { id } = req.query
  const product = Product.getById(Number(id))
  if (!product) {
    res.render('alert', {
      style: 'alert',
      info: 'Товар з таким ID не знайдено',
    })
  } else {
    res.render('product-edit', {
      style: 'product-edit',
      data: {
        product,
      },
    })
  }
})

router.post('/product-edit', function (req, res) {
  const { name, price, description } = req.body

  const updateByData = { name, price, description }

  const result = Product.updateById(Number(id))

  console.log(Product.getList())

  if (result) {
    res.render('alert', {
      style: 'alert',
      info: 'Дані товару оновлено',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Товар за таки ID не знайдено',
    })
  }
})

router.get('/product-delete', function (req, res) {
  const { id } = req.query
  Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    info: 'Товар видалено',
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
