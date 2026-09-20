const prisma = require("../config/prisma");

// =====================================
// CREATE PRODUCT
// =====================================

const createProduct = async (req, res) => {
    try {
      const {
        name,
        slug,
        description,
        price,
        stock,
        categoryId,
        images,
        variants,
      } = req.body;
  
      // Check if category exists
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
  
      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }
  
      // Check duplicate product name
      const existingProductName = await prisma.product.findFirst({
        where: {
          name,
        },
      });
  
      if (existingProductName) {
        return res.status(409).json({
          message: "Product with this name already exists",
        });
      }
  
      // Check duplicate product slug
      const existingProductSlug = await prisma.product.findUnique({
        where: {
          slug,
        },
      });
  
      if (existingProductSlug) {
        return res.status(409).json({
          message: "Product with this slug already exists",
        });
      }
  
      // Check duplicate quantities inside the request
      const quantities = variants.map((variant) => variant.quantity);
  
      const hasDuplicateQuantity =
        new Set(quantities).size !== quantities.length;
  
      if (hasDuplicateQuantity) {
        return res.status(400).json({
          message: "Duplicate variant quantities are not allowed",
        });
      }
  
      // Create product + images + variants in one transaction
      const product = await prisma.$transaction(async (tx) => {
        const newProduct = await tx.product.create({
          data: {
            name,
            slug,
            description,
            price,
            stock,
            categoryId,
          },
        });
  
        // Create images
        await tx.productImage.createMany({
          data: images.map((image, index) => ({
            url: image.url,
            altText: image.altText,
            isPrimary: image.isPrimary ?? index === 0,
            productId: newProduct.id,
          })),
        });
  
        // Create variants
        await tx.productVariant.createMany({
          data: variants.map((variant) => ({
            productId: newProduct.id,
            quantity: variant.quantity,
            price: variant.price,
            stock: variant.stock,
          })),
        });
  
        // Return complete product
        return tx.product.findUnique({
          where: {
            id: newProduct.id,
          },
          include: {
            category: true,
            images: true,
            variants: true,
          },
        });
      });
  
      return res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.error("Create product error:", error);
  
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };

// =====================================
// GET ALL PRODUCTS
// =====================================

// =====================================
// GET ALL PRODUCTS
// SEARCH + FILTER + SORT + PAGINATION
// =====================================

const getProducts = async (req, res) => {
    try {
      // ---------------------------------
      // 1. Read query parameters
      // ---------------------------------
  
      const {
        search,
        categoryId,
        minPrice,
        maxPrice,
        sort,
        page = "1",
        limit = "10",
      } = req.query;
  
      // ---------------------------------
      // 2. Convert query values
      // ---------------------------------
  
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
  
      if (
        !Number.isInteger(pageNumber) ||
        pageNumber < 1
      ) {
        return res.status(400).json({
          message: "Page must be a positive integer",
        });
      }
  
      if (
        !Number.isInteger(limitNumber) ||
        limitNumber < 1 ||
        limitNumber > 100
      ) {
        return res.status(400).json({
          message: "Limit must be between 1 and 100",
        });
      }
  
      // ---------------------------------
      // 3. Build WHERE condition
      // ---------------------------------
  
      const where = {};
  
      // Search by product name
      if (search) {
        where.name = {
          contains: search,
          mode: "insensitive",
        };
      }
  
      // Filter by category
      if (categoryId) {
        const categoryIdNumber = Number(categoryId);
  
        if (
          !Number.isInteger(categoryIdNumber) ||
          categoryIdNumber < 1
        ) {
          return res.status(400).json({
            message: "Invalid categoryId",
          });
        }
  
        where.categoryId = categoryIdNumber;
      }
  
      // Filter by minimum price
      if (minPrice) {
        const minPriceNumber = Number(minPrice);
  
        if (Number.isNaN(minPriceNumber) || minPriceNumber < 0) {
          return res.status(400).json({
            message: "Invalid minPrice",
          });
        }
  
        where.price = {
          ...(where.price || {}),
          gte: minPriceNumber,
        };
      }
  
      // Filter by maximum price
      if (maxPrice) {
        const maxPriceNumber = Number(maxPrice);
  
        if (Number.isNaN(maxPriceNumber) || maxPriceNumber < 0) {
          return res.status(400).json({
            message: "Invalid maxPrice",
          });
        }
  
        where.price = {
          ...(where.price || {}),
          lte: maxPriceNumber,
        };
      }
  
      // ---------------------------------
      // 4. Sorting
      // ---------------------------------
  
      let orderBy = {
        createdAt: "desc",
      };
  
      if (sort === "price_asc") {
        orderBy = {
          price: "asc",
        };
      }
  
      if (sort === "price_desc") {
        orderBy = {
          price: "desc",
        };
      }
  
      if (sort === "name_asc") {
        orderBy = {
          name: "asc",
        };
      }
  
      if (sort === "name_desc") {
        orderBy = {
          name: "desc",
        };
      }
  
      // ---------------------------------
      // 5. Pagination
      // ---------------------------------
  
      const skip = (pageNumber - 1) * limitNumber;
  
      // ---------------------------------
      // 6. Get products + total count
      // ---------------------------------
  
      const [products, totalProducts] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip,
          take: limitNumber,
          include: {
            category: true,
            images: true,
          },
        }),
  
        prisma.product.count({
          where,
        }),
      ]);
  
      // ---------------------------------
      // 7. Pagination information
      // ---------------------------------
  
      const totalPages = Math.ceil(
        totalProducts / limitNumber
      );
  
      // ---------------------------------
      // 8. Response
      // ---------------------------------
  
      return res.status(200).json({
        products,
  
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          totalProducts,
          totalPages,
          hasNextPage: pageNumber < totalPages,
          hasPreviousPage: pageNumber > 1,
        },
      });
    } catch (error) {
      console.error("Get products error:", error);
  
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };
// =====================================
// GET PRODUCT BY ID
// =====================================

const getProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        images: true,
        variants: true,
        reviews: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================
// UPDATE PRODUCT
// =====================================

const updateProduct = async (req, res) => {
    try {
      const productId = Number(req.params.id);
  
      if (!Number.isInteger(productId) || productId < 1) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }
  
      const {
        name,
        slug,
        description,
        price,
        stock,
        categoryId,
        images,
      } = req.body;
  
      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          images: true,
        },
      });
  
      if (!existingProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
  
      // Check category only when categoryId is provided
      if (categoryId !== undefined) {
        const category = await prisma.category.findUnique({
          where: {
            id: categoryId,
          },
        });
  
        if (!category) {
          return res.status(404).json({
            message: "Category not found",
          });
        }
      }
  
      // Check duplicate name
      if (name !== undefined && name !== existingProduct.name) {
        const existingProductName = await prisma.product.findFirst({
          where: {
            name,
            NOT: {
              id: productId,
            },
          },
        });
  
        if (existingProductName) {
          return res.status(409).json({
            message: "Product with this name already exists",
          });
        }
      }
  
      // Check duplicate slug
      if (slug !== undefined && slug !== existingProduct.slug) {
        const existingProductSlug = await prisma.product.findFirst({
          where: {
            slug,
            NOT: {
              id: productId,
            },
          },
        });
  
        if (existingProductSlug) {
          return res.status(409).json({
            message: "Product with this slug already exists",
          });
        }
      }
  
      // Build product update data
      const productData = {};
  
      if (name !== undefined) {
        productData.name = name;
      }
  
      if (slug !== undefined) {
        productData.slug = slug;
      }
  
      if (description !== undefined) {
        productData.description = description;
      }
  
      if (price !== undefined) {
        productData.price = price;
      }
  
      if (stock !== undefined) {
        productData.stock = stock;
      }
  
      if (categoryId !== undefined) {
        productData.categoryId = categoryId;
      }
  
      // Update product + images in one transaction
      const updatedProduct = await prisma.$transaction(async (tx) => {
        await tx.product.update({
          where: {
            id: productId,
          },
          data: productData,
        });
  
        // Only replace images when images are provided
        if (images !== undefined) {
          // Delete existing images
          await tx.productImage.deleteMany({
            where: {
              productId,
            },
          });
  
          // Create new images
          await tx.productImage.createMany({
            data: images.map((image, index) => ({
              url: image.url,
              altText: image.altText,
              isPrimary: image.isPrimary ?? index === 0,
              productId,
            })),
          });
        }
  
        return tx.product.findUnique({
          where: {
            id: productId,
          },
          include: {
            category: true,
            images: true,
          },
        });
      });
  
      return res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Update product error:", error);
  
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };
// =====================================
// DELETE PRODUCT
// =====================================

const deleteProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    // Check product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Delete product
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================
// EXPORT
// =====================================

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};