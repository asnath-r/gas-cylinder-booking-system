const db = require('../config/db');

const path = require('path');

exports.addCylinder = async (req, res) => {
    const { type, cost, area, stock } = req.body;
    const image = req.file?.path;

    //console.log('Request Body:', req.body);
    //console.log('Uploaded File:', req.file);
    //console.log('path',path.normalize(image));

    // Validation for required fields
    if (!type || !cost || !area || !stock || !image) {
        console.error('Validation Error: Missing fields');
        return res.status(400).json({
            status: 'error',
            message: 'All fields are required',
        });
    }

    try {
        // Execute the SQL query
        const result = await db.execute(
            'INSERT INTO Cylinders (image, type, cost, area, stock) VALUES (?, ?, ?, ?, ?)',
            [path.normalize(image), type, parseFloat(cost), area, parseInt(stock)]
        );

        console.log('Database Insert Result:', result);

        res.status(201).json({
            status: 'success',
            message: 'Cylinder added successfully',
        });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to add cylinder',
        });
    }
};


// Get all cylinders
exports.getCylinders = async (req, res) => {
  try {
    const [cylinders] = await db.execute('SELECT * FROM Cylinders');
    res.status(200).json({
      status: 'success',
      data: cylinders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch cylinders',
    });
  }
};

// Get Cylinder by ID
exports.getCylinderById = async (req, res) => {
  const { id } = req.params;

  try {
    const [cylinder] = await db.execute('SELECT * FROM Cylinders WHERE cylinder_id = ?', [id]);

    if (cylinder.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Cylinder not found',
        data: null,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Cylinder retrieved successfully',
      data: cylinder[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      data: null,
    });
  }
};


// Update a cylinder
exports.updateCylinder = async (req, res) => {
    const { id } = req.params;
    const { type, stock, cost, area } = req.body; // Corrected field name 'cost'
    const image = req.file ? req.file.path : null;

    // Validation for required fields
    if (!id || !type || !stock || !cost || !area) {
        return res.status(400).json({
            status: 'error',
            message: 'All fields (except image) are required',
        });
    }

    try {
        // Construct query and parameters based on image presence
        const query = image
            ? 'UPDATE Cylinders SET type = ?, stock = ?, cost = ?, area = ?, image = ? WHERE cylinder_id = ?'
            : 'UPDATE Cylinders SET type = ?, stock = ?, cost = ?, area = ? WHERE cylinder_id = ?';

        const params = image
            ? [type, parseInt(stock), parseFloat(cost), area, path.normalize(image), id]
            : [type, parseInt(stock), parseFloat(cost), area, id];

        // Execute the query
        const result = await db.execute(query, params);

        // Check if any row was updated
        if (result[0].affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Cylinder not found',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Cylinder updated successfully',
        });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update cylinder',
        });
    }
};


// Update a cylinder (Partial update with PATCH)
exports.updateCylinder = async (req, res) => {
    const { id } = req.params; // Extract cylinder ID
    const { type, stock, cost, area } = req.body; // Extract optional fields
    const image = req.file ? req.file.path : null; // Handle optional image

    // Ensure ID is provided
    if (!id) {
        return res.status(400).json({
            status: 'error',
            message: 'Cylinder ID is required',
        });
    }

    try {
        // Construct dynamic query based on provided fields
        const fieldsToUpdate = [];
        const params = [];

        if (type) {
            fieldsToUpdate.push('type = ?');
            params.push(type);
        }
        if (stock) {
            fieldsToUpdate.push('stock = ?');
            params.push(parseInt(stock));
        }
        if (cost) {
            fieldsToUpdate.push('cost = ?');
            params.push(parseFloat(cost));
        }
        if (area) {
            fieldsToUpdate.push('area = ?');
            params.push(area);
        }
        if (image) {
            fieldsToUpdate.push('image = ?');
            params.push(path.normalize(image));
        }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'No fields provided for update',
            });
        }

        // Add cylinder_id to params
        params.push(id);

        // Execute the update query
        const query = `UPDATE Cylinders SET ${fieldsToUpdate.join(', ')} WHERE cylinder_id = ?`;
        const result = await db.execute(query, params);

        // Check if any row was updated
        if (result[0].affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Cylinder not found',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Cylinder updated successfully',
        });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update cylinder',
        });
    }
};

// Delete a cylinder
exports.deleteCylinder = async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute('DELETE FROM Cylinders WHERE cylinder_id = ?', [id]);
    res.status(200).json({
      status: 'success',
      message: 'Cylinder deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete cylinder',
    });
  }
};

//filter
exports.getCylindersByFilters = async (req, res) => {
  const { area, type } = req.query;

  let query = 'SELECT * FROM cylinders WHERE 1=1';
  const params = [];

  if (area) {
    query += ' AND area = ?';
    params.push(area);
  }

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  try {
    const [rows] = await db.execute(query, params);
    res.status(200).json({
      status: 'success',
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching cylinders:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch cylinders',
    });
  }
};
