"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultAddress = exports.deleteAddress = exports.updateAddress = exports.createAddress = exports.getAddresses = void 0;
const client_1 = require("@prisma/client");
const ApiError_1 = require("../../utils/ApiError");
const asyncHandler_1 = require("../../utils/asyncHandler");
const prisma = new client_1.PrismaClient();
exports.getAddresses = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const addresses = await prisma.address.findMany({
        where: { userId },
        orderBy: { isDefault: 'desc' },
    });
    res.status(200).json({
        status: 'success',
        data: addresses,
    });
});
exports.createAddress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { fullName, phone, addressLine1, addressLine2, landmark, city, state, postalCode, country, addressType, isDefault, } = req.body;
    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode || !country) {
        throw new ApiError_1.ApiError(400, 'All fields except addressLine2 and landmark are required');
    }
    // Check if this is the first address, if so, make it default automatically
    const count = await prisma.address.count({ where: { userId } });
    const makeDefault = count === 0 ? true : !!isDefault;
    // If this address is default, unset any previous defaults
    if (makeDefault) {
        await prisma.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
        });
    }
    const address = await prisma.address.create({
        data: {
            userId,
            fullName,
            phone,
            addressLine1,
            addressLine2,
            landmark,
            city,
            state,
            postalCode,
            country,
            addressType: addressType || 'HOME',
            isDefault: makeDefault,
        },
    });
    res.status(201).json({
        status: 'success',
        data: address,
    });
});
exports.updateAddress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;
    const { fullName, phone, addressLine1, addressLine2, landmark, city, state, postalCode, country, addressType, isDefault, } = req.body;
    const existingAddress = await prisma.address.findUnique({
        where: { id },
    });
    if (!existingAddress) {
        throw new ApiError_1.ApiError(404, 'Address not found');
    }
    if (existingAddress.userId !== userId) {
        throw new ApiError_1.ApiError(403, 'Not authorized to update this address');
    }
    // If marking as default, unset other defaults
    if (isDefault && !existingAddress.isDefault) {
        await prisma.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
        });
    }
    const updated = await prisma.address.update({
        where: { id },
        data: {
            fullName,
            phone,
            addressLine1,
            addressLine2,
            landmark,
            city,
            state,
            postalCode,
            country,
            addressType,
            isDefault: isDefault !== undefined ? !!isDefault : existingAddress.isDefault,
        },
    });
    res.status(200).json({
        status: 'success',
        data: updated,
    });
});
exports.deleteAddress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;
    const existingAddress = await prisma.address.findUnique({
        where: { id },
    });
    if (!existingAddress) {
        throw new ApiError_1.ApiError(404, 'Address not found');
    }
    if (existingAddress.userId !== userId) {
        throw new ApiError_1.ApiError(403, 'Not authorized to delete this address');
    }
    await prisma.address.delete({
        where: { id },
    });
    // If we deleted the default address, make the most recent address default
    if (existingAddress.isDefault) {
        const nextAddress = await prisma.address.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        if (nextAddress) {
            await prisma.address.update({
                where: { id: nextAddress.id },
                data: { isDefault: true },
            });
        }
    }
    res.status(200).json({
        status: 'success',
        message: 'Address deleted successfully',
    });
});
exports.setDefaultAddress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;
    const existingAddress = await prisma.address.findUnique({
        where: { id },
    });
    if (!existingAddress) {
        throw new ApiError_1.ApiError(404, 'Address not found');
    }
    if (existingAddress.userId !== userId) {
        throw new ApiError_1.ApiError(403, 'Not authorized to update this address');
    }
    // Set all user's addresses default to false
    await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
    });
    // Set selected address default to true
    const updated = await prisma.address.update({
        where: { id },
        data: { isDefault: true },
    });
    res.status(200).json({
        status: 'success',
        data: updated,
    });
});
//# sourceMappingURL=address.controller.js.map