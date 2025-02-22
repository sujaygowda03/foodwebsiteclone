const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
require('dotenv').config(); 

const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY; 

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

const addFirm = async(req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;

        const image = req.file ? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            res.status(404).json({ message: "Vendor not found" })
        }

        if (vendor.firm.length > 0) {
            return res.status(400).json({ message: "vendor can have only one firm" });
        }

        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        })

        const savedFirm = await firm.save();

        const firmId = savedFirm._id
        const vendorFirmName = savedFirm.firmName

        vendor.firm.push(savedFirm)

        await vendor.save()

        return res.status(200).json({ message: 'Firm Added successfully ', firmId, vendorFirmName });

    } catch (error) {
        console.error(error)
        res.status(500).json("intenal server error")
    }
}

const deleteFirmById = async(req, res) => {
    try {
        const firmId = req.params.firmId;

        const deletedProduct = await Firm.findByIdAndDelete(firmId);

        if (!deletedProduct) {
            return res.status(404).json({ error: "No product found" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
}

const getFirmArea = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({ message: "Firm not found" });
        }

        const areaName = firm.area;
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(areaName)}.json?access_token=${MAPBOX_API_KEY}`;

        const response = await axios.get(geocodeUrl);
        const data = response.data;

        if (data.features && data.features.length > 0) {
            const coordinates = data.features[0].center;
            const area = {
                name: areaName,
                latitude: coordinates[1],
                longitude: coordinates[0]
            };
            return res.status(200).json({ area });
        } else {
            return res.status(404).json({ message: "Coordinates not found for the area" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { addFirm: [upload.single('image'), addFirm], deleteFirmById, getFirmArea }