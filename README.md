# __Membangun REST API sederhana dengan Express JS dan ORM Prisma__

## ERD Database

Contoh ERD dengan mermaid: https://mermaid.js.org/syntax/entityRelationshipDiagram.html

```mermaid
---
title: ERD Database
---
erDiagram
   Product }|--|| Category : categoryId
   Product {

      id         Int       PK   "@id @default(autoincrement())"
      name       String         "@unique"
      price      Int            "@default(999)"
      quantity   Int            "@default(0)"
      createdAt  DateTime       "@default(now())"
      categoryId Int       FK
   }

   Category {
      id       Int         PK    "@id @default(autoincrement())"
      name     String
   }
   
   User_Product{
       user_id      Int
       product_id   Int
   }

   Product }|--|| User_Product : product_id
   Users }|--|| User_Product : user_id
   Users ||--|| Otp : user_id
   Users {
      id                  Int            PK       "@id @default(autoincrement())"
      uuid                String         UK       "@default(uuid()) @unique"
      email               String         UK       "@unique"
      password            String                  "hash"
      createdAt           DateTime                "@default(now())"
      updatedAt           DateTime                "@updatedAt"
      deletedAt           DateTime                "nullable"
      status              Boolean                 "@default(false)"
      last_access         DateTime                "nullable"
   }
   Otp{
      id                  Int         PK      "@id @default(autoincrement())"
      code                String
      status              Boolean             "@default(false)"
      timestamp           DateTime            "@default(now())"
      user_id             Int         UK      "@unique"
   }

```

## __Inisiasi Project__
1. Buatlah folder untuk project Todo List dengan perintah: 
    ```
    mkdir todo-list
    ```
    <br>__Output:__
    
    ![image](./images/image_0.png) 

2. Kemudian masuk ke folder project dan install express-draf dengan perintah: 
    ```
    npm i -g express-draft
    ```
    <br>__Output:__

    ![image](./images/image_1.png) 

3. Inisialisasi aplikasi express baru dengan perintah: 
    ```
    exp .
    ```
    <br>__Output:__
    
    ![image](./images/image_2.png) 
4. Kemudian muncul beberapa folder dan file setelah kita selesai melakukan inisialisasi.

    ![image](./images/image_3.png) 

    - folder node_modules: berisi modul-modul yang terinstal dari konfigurasi package di file package.json
    - folder routes
    - .env: File .env berisi environment variabel, sekarang kita hanya memiliki satu variabel yaitu `PORT`. 
        ```
        PORT=3000

        ```
    - app.js: Untuk file app.js berisi beberapa source code.
        ```
        const express = require('express');
        const createError = require('http-errors');
        const morgan = require('morgan');
        require('dotenv').config();

        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(morgan('dev'));

        app.get('/', async (req, res, next) => {
        res.send({ message: 'Awesome it works 🐻' });
        });

        app.use('/api', require('./routes/api.route'));

        app.use((req, res, next) => {
        next(createError.NotFound());
        });

        app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.send({
            status: err.status || 500,
            message: err.message,
        });
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));

        ```

    - package.json: sebuah file yang digunakan untuk mengelola dependensi yang akan kita gunakan.

5. Kemudian lihat isi file package.json disini terlihat sudah ada beberapa dependensi seperti,
    - dotenv
    - express
    - http-errors: untuk menangani semua kesalahan HTTP
    - morgan: sebagai logger
    - nodemon: digunakan untuk memulai ulang aplikasi
        ```
            {
                "name": "todo-list",
                "version": "1.0.0",
                "description": "",
                "main": "app.js",
                "scripts": {
                    "start": "node app.js",
                    "dev": "nodemon app.js"
                },
                "keywords": [],
                "author": "",
                "license": "MIT",
                "dependencies": {
                    "@prisma/client": "^4.10.1",
                    "dotenv": "^16.0.3",
                    "express": "^4.18.2",
                    "http-errors": "^2.0.0",
                    "morgan": "^1.10.0"
                },
                "devDependencies": {
                    "nodemon": "^2.0.20",
                    "prisma": "^4.10.1"
                }
            }
        ```


6. Menjalankan aplikasi dengan script npm run dev
    ![image](./images/image_6.png)

    sekarang aplikasi kita berjalan di port 3000, mari kita lihat kembali di file package.json terdapat script seperti ini:
    ```
    "scripts": {
        "start": "node app.js",
        "dev": "nodemon app.js"
    }
    ```

    kita dapat menjalankan aplikasi ini dengan menjalankan script: 
    ```
    npm start
    ``` 
    
    atau 
    ```
    npm run dev
    ```
    
    Setelah menjalankan aplikasi mari kita coba lihat aplikasi kita melalui sebuah browser dengan mengetikan alamat `http://localhost:3000` . Maka akan muncul tampilan seperti ini:

    ![image](./images/image_8.png)

    program yang dipanggil adalah endpoint yang ada di file app.js, 
    ```
    app.get('/', async(req, res, next)=>{
        res.send({message: 'Awesome it works 🐻'})
    });
    ```

    sampai di sini kita sudah memiliki aplikasi server, artinya aplikasi server kita telah berfungsi atau berjalan.
    Selanjutnya mari kita coba panggil `http://localhost:3000/api/hello`, kemudian akan muncul seperti 
    
    ![image](./images/image_10.png)

    ini artinya error ini telah ditangani oleh modul http-errors.

    Dari inisialisasi project yang telah kita buat kita memiliki folder routes, mari kita panggil route yang ada dengan url `http://localhost:3000/api`, 

    ![image](./images/image_11.png)

    dari hasil ini kita dapat melihat bahwa endpoint yang dipanggil adalah endpoint yang ada di file app.js 
    ```
    app.use('/api', require('./routes/api.route'));
    ```
    
    kemudian mengarah ke file api.route.js di folder routes.
    ```
    app.get('/', async(req, res, next)=>{
        res.send({message: 'Ok api is working 🚀'})
    });
    ```

    Sampai di sini kita telah memiliki aplikasi server dengan rute, untuk rute-rute yang lain kita dapat menambahkannya di api.route.js 

## Install Prisma
1. Kita akan menginstal dependensi prisma CLI dengan script: 
    ```
    npm i -D prisma
    ```
    
    <br>__Output:__

    ![image](./images/image_14.png)

2. Install prisma client untuk membuat semua query ke database, dengan script: 
    ```
    npm i @prisma/client  
    ```
    <br>__Output:__
    ![image](./images/image_15.png)

3. Inisialisasi prisma dengan script 
    ```
    npx prisma init
    ```
    <br>__Output:__
    ![image](./images/image_4.png)

    kemudian muncul folder baru bernama prisma
    
    ![image](./images/image_5.png)


    dan di file .env akan terdapat satu environment variabel baru yaitu
    ```
    DATABASE_URL="postgresql://johndoe:randomassworpd@localhost:5432/mydb?schema=public"
    ```

    silakan ganti konfigurasi di file .env, sesuaikan dengan database yang kita gunakan, untuk lebih lengkapnya silakan baca dokumentasi resmi di website prisma.
    ```
    DATABASE_URL="mysql://username:PASSWORD@host:PORT/DATABASE?KEY1=VALUE&KEY2=VALUE&KEY3=VALUE"
    ```

    ```
    username: root
    password: password
    host: localhost
    port: 3306
    database: todo_list
    ```

    contoh:
    ```
    mysql://root:PASSWORD@localhost:3306/todo_list?connection_limit=5&socket_timeout=3
    ```

    di prisma ini kita dapat menggunakan database SQL ataupun  NOSQL. Mari kita lihat di file schema.prisma

    ```
    generator client {
        provider = "prisma-client-js"
    }

    datasource db {
        provider = "mysql"
        url      = env("DATABASE_URL")
    }

    ```

4. Buat model atau membuat tabel
    ```
    model Product {
        id         Int       @id @default(autoincrement())
        name       String    @unique
        price      Int       @default(999)
        createdAt  DateTime  @default(now())
        categories Category? @relation(fields: [categoryId], references: [id])
        categoryId Int?
    }

    model Category {
        id       Int       @id @default(autoincrement())
        products Product[]
        name     String
    }

    ```
    ```
    Tabel Product: 
        id          (Integer), 
        name        (String), 
        price       (Integer), 
        createdAt   (Datetime), 
        categoryId  (Integer)

    Tabel Category: 
        id   (Integer)
        name (String)

    Relasi Tabel: Category one to many Product
    ```
    

5. Mari kita buka prisma menggunakan prisma studio, cukup dengan script: npx prisma studio, maka akan muncul tampilan seperti di bawah ini. Namun ketika kita memilih salah satu model, akan terjadi error dikarenakan kita belum membuat tabel di dalam database. Kita perlu migrasi database terlebih dahulu.
    ```
    npx prisma studio
    ```
    <br>__Output:__

    ![image](./images/image_7.png)

    
    ![image](./images/image_9.png)

6. Selanjutnya kita migrasi terlebih dahulu cukup menggunakan script: 
    ```
    npx prisma migrate dev
    ```
    <br>__Output:__

    ![image](./images/image_12.png)
    Kemudian akan muncul folder migrations. Sampai di sini kita telah berhasil membuat tabel di database. Kita dapat melihatnya dengan menjalankan kembali prisma studio.

    ![image](./images/image_13.png)

    ![image](./images/image_16.png)

7. Silakan install postman atau tools sejenisnya yang digunakan untuk test API, atau jika kita menggunakan VS code kita dapat menggunakan rest client, tinggal kita install package-nya saja.

    ![image](./images/image_17.png)


    Kemudian buat file rest.client dan isinya seperti ini, untuk menjalankan tinggal klik send request

    ```
    ####
    # Get All product
    GET http://localhost:3000/api/products

    ###
    # Create new product
    POST http://localhost:3000/api/products
    Content-Type: application/json

    {
        "name": "Mangkok Masako",
        "price": 999,
        "categoryId": 3
    }

    ####
    # Get product by id
    GET http://localhost:3000/api/products/2

    ####
    # Update product by id
    PATCH http://localhost:3000/api/products/4
    Content-Type: application/json

    {
        "name": "Mangkok Royko",
        "price": 8888,
        "categoryId": 3
    }

    ####
    # Delete product by id
    DELETE http://localhost:3000/api/products/2
    ```



8. Mari kita buat rute untuk endpoint Create, Update, Delete, Get All, Get One pada file api.route.js
    - pertama kita import prisma client
        ```
        const router = require('express').Router();
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        module.exports = router;

        ```

    - buat endpoint get all product
        ```
        // Endpoint for get all products
        router.get('/products', async (req, res, next) => {
        try {
            const products = await prisma.product.findMany({
            include: {categories: true}
            })

            const categories = await prisma.Category.findMany({
            include:{products: true}
            })
            res.json({products, categories})
        } catch (error) {
            next(error)
        }
        });
        ```

    - buat endpoint create product
        ```
        // Endpoint for create new products
        router.post('/products', async (req, res, next) => {
        try {
            const product = await prisma.Product.create({
            data : req.body
            })

            res.json({product})
        } catch (error) {
            next(error)
        }
        });

        ```

    - buat endpoint get one by id
        ```
        // Endpoint for get products by id
        router.get('/products/:id', async (req, res, next) => {
        try {
            const {id} = req.params
            const product = await prisma.Product.findUnique({
            where:{
                id: Number(id)
            },
            include: {categories:true}
            })
            res.json(product)
        } catch (error) {
            next(error)
        }
        });
        ```


    - buat endpoint update product by id
        ```
        // Endpoint for update products by id
        router.patch('/products/:id', async (req, res, next) => {
        try {
            const {id} = req.params
            const product = await prisma.Product.update({
            data: req.body,
            where:{
                id: Number(id)
            },
            include: {categories:true}
            })
            res.json(product)
        } catch (error) {
            next(error)
        }
        });
        ```

    - buat endpoint delete product by id
        ```
        // Endpoint for delete products by id
        router.delete('/products/:id', async (req, res, next) => {
        try {
            const {id} = req.params
            const product = await prisma.Product.delete({
            where:{
                id: Number(id)
            }
            })
            res.json(product)
        } catch (error) {
            next(error)
        }
        });
        ```
9. Mari kita mencoba untuk menambahkan kolom baru di tabel product
    ```
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "mysql"
      url      = env("DATABASE_URL")
    }

    model Product {
      id         Int       @id @default(autoincrement())
      name       String    @unique
      price      Int       @default(999)
      quantity   Int
      createdAt  DateTime  @default(now())
      categories Category? @relation(fields: [categoryId], references: [id])
      categoryId Int?
    }

    model Category {
      id       Int       @id @default(autoincrement())
      products Product[]
      name     String
    }

    ```

    Kemudian kita migrate menggunakan script ini, sebelum kita migrate, kita matikan program yang sedang berjalan dengan cara ctrl+c atau kill manual (sesuaikan dengan operasi system masing-masing):
    ![image](./images/image_19.png)
    ```
    npx prisma migrate dev
    ```

    maka akan terjadi kesalahan seperti ini:
    ![image](./images/image_18.png)

    kita harus memberikan default value untuk kolom yang ingin kita tambahkan, 

    ```
    model Product {
          id         Int       @id @default(autoincrement())
          name       String    @unique
          price      Int       @default(999)
          quantity   Int       @default(0)
          createdAt  DateTime  @default(now())
          categories Category? @relation(fields: [categoryId], references: [id])
          categoryId Int?
        }
    ```
    ![image](./images/image_20.png)

## __Kode keseluruhan__

__api.route.js__

```
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Endpoint for get all products
router.get('/products', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: {categories: true}
    })

    const categories = await prisma.Category.findMany({
      include:{products: true}
    })
    res.json({products, categories})
  } catch (error) {
    next(error)
  }
});

// Endpoint for get products by id
router.get('/products/:id', async (req, res, next) => {
  try {
    const {id} = req.params
    const product = await prisma.Product.findUnique({
      where:{
        id: Number(id)
      },
      include: {categories:true}
    })
    res.json(product)
  } catch (error) {
    next(error)
  }
});

// Endpoint for create new products
router.post('/products', async (req, res, next) => {
  try {
    const product = await prisma.Product.create({
      data : req.body
    })

    res.json({product})
  } catch (error) {
    next(error)
  }
});

// Endpoint for delete products by id
router.delete('/products/:id', async (req, res, next) => {
  try {
    const {id} = req.params
    const product = await prisma.Product.delete({
      where:{
        id: Number(id)
      }
    })
    res.json(product)
  } catch (error) {
    next(error)
  }
});

// Endpoint for update products by id
router.patch('/products/:id', async (req, res, next) => {
  try {
    const {id} = req.params
    const product = await prisma.Product.update({
      data: req.body,
      where:{
        id: Number(id)
      },
      include: {categories:true}
    })
    res.json(product)
  } catch (error) {
    next(error)
  }
});

module.exports = router;

```
__app.js__
```
const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.use('/api', require('./routes/api.route'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));

```

__.env__
```
PORT=3000

DATABASE_URL="mysql://username:your_password@localhost:3306/todo_list?connection_limit=5&socket_timeout=3"

```
__scheme.prisma__
```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Product {
  id         Int       @id @default(autoincrement())
  name       String    @unique
  price      Int       @default(999)
  createdAt  DateTime  @default(now())
  categories Category? @relation(fields: [categoryId], references: [id])
  categoryId Int?
}

model Category {
  id       Int       @id @default(autoincrement())
  products Product[]
  name     String
}

```

__package.json__
```
{
  "name": "todo-list",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@prisma/client": "^4.10.1",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "http-errors": "^2.0.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "prisma": "^4.10.1"
  }
}

```

__API Doc__

```
Get All product
  Request:
  GET http://localhost:3000/api/products

  Response:

  {
    "products": [
      {
        "id": 1,
        "name": "Gelas Plastik",
        "price": 999,
        "createdAt": "2023-02-14T02:48:48.253Z",
        "categoryId": 3,
        "categories": {
          "id": 3,
          "name": "RT"
        }
      },
      {
        "id": 4,
        "name": "Mangkok Royko",
        "price": 8888,
        "createdAt": "2023-02-14T04:07:38.610Z",
        "categoryId": 3,
        "categories": {
          "id": 3,
          "name": "RT"
        }
      }
    ],
    "categories": [
      {
        "id": 3,
        "name": "RT",
        "products": [
          {
            "id": 1,
            "name": "Gelas Plastik",
            "price": 999,
            "createdAt": "2023-02-14T02:48:48.253Z",
            "categoryId": 3
          },
          {
            "id": 4,
            "name": "Mangkok Royko",
            "price": 8888,
            "createdAt": "2023-02-14T04:07:38.610Z",
            "categoryId": 3
          }
        ]
      },
      {
        "id": 4,
        "name": "Smartphone",
        "products": []
      },
      {
        "id": 5,
        "name": "PC",
        "products": []
      },
      {
        "id": 6,
        "name": "Laptop",
        "products": []
      }
    ]
  }

Create new product
  Request:
  POST http://localhost:3000/api/products
  Content-Type: application/json

  {
      "name": "Mangkok Masako",
      "price": 999,
      "categoryId": 3
  }


  Response:
  {
    "product": {
      "id": 5,
      "name": "Mangkok Masako",
      "price": 999,
      "createdAt": "2023-02-15T01:50:12.233Z",
      "categoryId": 3
    }
  }

Get product by id
  Request:
  GET http://localhost:3000/api/products/4

  Response:

  {
    "id": 4,
    "name": "Mangkok Royko",
    "price": 8888,
    "createdAt": "2023-02-14T04:07:38.610Z",
    "categoryId": 3,
    "categories": {
      "id": 3,
      "name": "RT"
    }
  }


Update product by id
  Request:
  PATCH http://localhost:3000/api/products/4
  Content-Type: application/json

  {
      "name": "Mangkok Jagoo",
      "price": 90000,
      "categoryId": 3
  }

  Response:
  {
    "id": 4,
    "name": "Mangkok Jagoo",
    "price": 90000,
    "createdAt": "2023-02-14T04:07:38.610Z",
    "categoryId": 3,
    "categories": {
      "id": 3,
      "name": "RT"
    }
  }


Delete product by id
  Request:
  DELETE http://localhost:3000/api/products/2

  Response:
  {
    "id": 4,
    "name": "Mangkok Jagoo",
    "price": 90000,
    "createdAt": "2023-02-14T04:07:38.610Z",
    "categoryId": 3
  }
```


Referensi:
- https://www.prisma.io/docs/concepts/database-connectors/mysql
- https://www.youtube.com/watch?v=HCJmlvgO2WY 


## Deployment To Server

1. Masuk ke server melalui SSH
   
   ```shell
   # ssh <username>@<domain/ip> -p <port>
   ssh username@domain.com -p 12345
   ```
   
   Cara masuk dengan SSH dapat menggunakan public key atau password.

2. Kemudian masuk ke directory dimana kita ingin menyimpan project kita.

   ```shell
   cd nama_direktori
   ```
   
3. Kemudian Clone project kita dari repository

   ```shell
   git clone https://github.com/user/project.git .
   ```

   titik (.) disini artinya kita clone ke dalam folder project kita saat ini.

4. Install dependensi dengan ```pnpm``` (jika belum ada pnpm https://pnpm.io/id/installation) atau dengan ```npm``` (Gunakan npm saja. ).

   ```shell
   # cek versi pnpm atau npm
   pnpm -v

   # cek versi pnpm atau npm
   npm -v
   
   # install depedensi dengan pnpm
   pnpm i

   # install depedensi dengan npm
   npm i

   ```

5. Setup file .env di directory project kita

   ```env
   PORT=12345
   DATABASE_URL="mysql://root:12345@localhost:3306/todolist"
   ```
   
6. Selanjutnya lakukan migration prisma (jika belum ada npx https://www.npmjs.com/package/npx)

   ```shell
   # check npx
   npx -v
   
   # migrate database
   npx prisma migrate deploy
   ```
   
7. Buat config PM2 (untuk install pm2 silakan cari di https://pm2.keymetrics.io/docs/usage/quick-start/).

   Keluar dari directory project kita dan buat folder baru dengan command:
   ```shell
   cd ..
   
   mkdir "pm2"
   
   nano "pm2-project.json"
   ```
   
   masukkan config berikut ini:
   ```json
   {
     "apps": [{
       "name": "rest-api",
       "cwd": "./",
       "script": "./app.js",
       "node_args": "--expose-gc",
       "watch": false,
       "ignore_watch": [
         "./node_modules",
         "./.git"
       ],
       "log_date_format": "YYYY-MM-DD HH:mm Z",
       "exec_mode": "cluster",
       "instance": "1",
       "max_memory_restart": "512",
       "env": {
         "PORT": "5002"
       }
     }]
   }
   ```
   
   property yang perlu diperhatikan yaitu 
      - name (nama-project),
      - cwd (lokasi folder project kita), 
      - script (lokasi file utama kita didasarkan pada cwd-nya ) dan 
      - PORT (port untuk jalur aplikasi kita)
      - untuk property yang lain silakan pelajari di dokumentasinya pada link ini https://pm2.keymetrics.io/docs/usage/environment/.
   
   Kemudian save dengan cara ```ctrl x```, ketikan yes dan enter.

8. Jalankan aplikasinya

   ```shell
   pm2 start pm2-project.json
   ```
   
   untuk command pm2:

   ```shell
   # melihat aplikasi yang berjalan
   pm2 ls
   
   # menghentikan aplikasi
   pm2 stop id
   
   # menjalankan aplikasi
   pm2 start id
   
   # menghapus aplikasi dari pm2
   pm2 delete id
   
   # melihat logs
   pm2 logs
   ```


**Catatan:** 

```Deployment ini hanya dilakukan sekali saja, atau pertama kali ketika ingin mendeploy apps kita di server.```


## Untuk mengupdate source code apps kita di server:
1. Pertama, ubah source code kita dari local PC kita, kemudian kita commit dan kita push perubahan source code kita ke git atau repository.

2. Kedua, kita masuk ke folder project kita di server, kemudian kita pull dengan menjalankan:

    ```shell
    git pull
    ```

    Pastikan kita melakukan pull sesuai dengan branch yang kita push. Unruk melihat branch saat ini bisa menjalankan:

    ```shell
    git branch
    ```

    untuk pindah branch, jalankan perintah:

    ```shell
    git checkout nama_branch
    ```

    Pastikan tidak ada perubahan di folder project kita di server sebelum melakukan pull. Untuk melihat status perubahan kita bisa menjalankan perintah:

    ```shell
    git status
    ```

3. Ketiga restart ```pm2``` nya:

    ```shell
    pm2 restart id_pm2

    ```

4. Keempat, pastikan apps kita berjalan dengan baik. Untuk melihatnya, kita bisa jalankan perintah:

    ```shell
    pm2 ls
    ```

    atau untuk melihat logs:

    ```shell
    pm2 logs
    ```

    untuk keluar dari logs cukup tekan ````ctrl + c```` .







