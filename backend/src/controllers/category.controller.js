const prisma = require("../config/prisma");

// =====================================
// CREATE CATEGORY
// =====================================

const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
      },
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category name or slug already exists",
      });
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================
// GET ALL CATEGORIES
// =====================================

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================
// GET CATEGORY BY ID
// =====================================

const getCategoryById = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    if (Number.isNaN(categoryId)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

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

    return res.status(200).json({
      category,
    });
  } catch (error) {
    console.error("Get category error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================
// UPDATE CATEGORY
// =====================================

const updateCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    // Validate ID
    if (Number.isNaN(categoryId)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const { name, slug } = req.body;

    // Check whether category exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Check whether another category already uses
    // the same name or slug
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
        NOT: {
          id: categoryId,
        },
      },
    });

    if (duplicateCategory) {
      return res.status(409).json({
        message: "Category name or slug already exists",
      });
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        slug,
      },
    });

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


// =====================================
// DELETE CATEGORY
// =====================================

const deleteCategory = async (req, res) => {
    try {
      const categoryId = Number(req.params.id);
  
      // Validate ID
      if (Number.isNaN(categoryId)) {
        return res.status(400).json({
          message: "Invalid category ID",
        });
      }
  
      // Check whether category exists
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
        include: {
          products: true,
        },
      });
  
      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }
  
      // Don't delete category if products exist
      if (category.products.length > 0) {
        return res.status(409).json({
          message:
            "Cannot delete category because products are assigned to it",
        });
      }
  
      // Delete category
      await prisma.category.delete({
        where: {
          id: categoryId,
        },
      });
  
      return res.status(200).json({
        message: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Delete category error:", error);
  
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };

// =====================================
// EXPORT CONTROLLERS
// =====================================

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};