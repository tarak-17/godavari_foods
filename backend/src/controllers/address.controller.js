const prisma = require("../config/prisma");

const createAddress = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    // If this is the first address, make it default automatically
    const existingAddressCount = await prisma.address.count({
      where: {
        userId,
      },
    });

    const shouldBeDefault =
      existingAddressCount === 0 || isDefault === true;

    // If this address is default, remove default from other addresses
    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country: country || "India",
        isDefault: shouldBeDefault,
      },
    });

    return res.status(201).json({
      message: "Address created successfully",
      address,
    });
  } catch (error) {
    console.error("Create address error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const addresses = await prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: {
        isDefault: "desc",
      },
    });

    return res.status(200).json({
      message: "Addresses fetched successfully",
      addresses,
    });
  } catch (error) {
    console.error("Get addresses error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getAddressById = async (req, res) => {
    try {
      const userId = req.user.userId;
      const addressId = Number(req.params.id);
  
      if (!Number.isInteger(addressId) || addressId < 1) {
        return res.status(400).json({
          message: "Invalid address ID",
        });
      }
  
      const address = await prisma.address.findFirst({
        where: {
          id: addressId,
          userId,
        },
      });
  
      if (!address) {
        return res.status(404).json({
          message: "Address not found",
        });
      }
  
      return res.status(200).json({
        message: "Address fetched successfully",
        address,
      });
    } catch (error) {
      console.error("Get address by ID error:", error);
  
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };

  const updateAddress = async (req, res) => {
    try {
      const userId = req.user.userId;
      const addressId = Number(req.params.id);
  
      if (!Number.isInteger(addressId) || addressId < 1) {
        return res.status(400).json({
          message: "Invalid address ID",
        });
      }
  
      const existingAddress = await prisma.address.findFirst({
        where: {
          id: addressId,
          userId,
        },
      });
  
      if (!existingAddress) {
        return res.status(404).json({
          message: "Address not found",
        });
      }
  
      const {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        isDefault,
      } = req.body;
  
      if (isDefault === true) {
        await prisma.address.updateMany({
          where: {
            userId,
            isDefault: true,
            id: {
              not: addressId,
            },
          },
          data: {
            isDefault: false,
          },
        });
      }
  
      const address = await prisma.address.update({
        where: {
          id: addressId,
        },
        data: {
          ...(fullName !== undefined && { fullName }),
          ...(phone !== undefined && { phone }),
          ...(addressLine1 !== undefined && { addressLine1 }),
          ...(addressLine2 !== undefined && { addressLine2 }),
          ...(city !== undefined && { city }),
          ...(state !== undefined && { state }),
          ...(postalCode !== undefined && { postalCode }),
          ...(country !== undefined && { country }),
          ...(isDefault !== undefined && { isDefault }),
        },
      });
  
      return res.status(200).json({
        message: "Address updated successfully",
        address,
      });
    } catch (error) {
      console.error("Update address error:", error);
  
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };


  const deleteAddress = async (req, res) => {
    try {
      const userId = req.user.userId;
      const addressId = Number(req.params.id);
  
      if (!Number.isInteger(addressId) || addressId < 1) {
        return res.status(400).json({
          message: "Invalid address ID",
        });
      }
  
      const address = await prisma.address.findFirst({
        where: {
          id: addressId,
          userId,
        },
      });
  
      if (!address) {
        return res.status(404).json({
          message: "Address not found",
        });
      }
  
      const orderUsingAddress = await prisma.order.findFirst({
        where: {
          addressId,
        },
      });
  
      if (orderUsingAddress) {
        return res.status(400).json({
          message: "Cannot delete an address used by an existing order",
        });
      }
  
      await prisma.address.delete({
        where: {
          id: addressId,
        },
      });
  
      return res.status(200).json({
        message: "Address deleted successfully",
      });
    } catch (error) {
      console.error("Delete address error:", error);
  
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };

module.exports = {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};