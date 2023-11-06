const { application } = require('express');
const mysql = require('mysql2');
const async = require('async');
const { drop } = require('prelude-ls');

const connection = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pharmacy',
    port: 3307,
    dateStrings: 'date',
    multipleStatements: true
});

exports.home = (req, res) => {
    res.render('home', {
        layout: false
    });
}

exports.pharmacy_order = (req, res) => {
    connection.query('SELECT * FROM storage WHERE storage.stock_amount < storage.regulatory_balance;', (err, pharmacy_order) => {
        if (!err) {
            res.render('pharmacy_order', {
                pharmacy_order,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", pharmacy_order);
    });
}

exports.pharmacy_order_add = (req, res) => {
    let searchKey = req.body.search;

    connection.query('INSERT INTO pharmacy_order (order_date, barcode, medicine_name, medicine_amount, supplier_barcode, storage_id) ' +
    'SELECT CURDATE(), barcode, name, (regulatory_balance - stock_amount) AS order_amount, supplier_barcode, storage_id ' +
    'FROM storage WHERE (regulatory_balance - stock_amount) > 0;', (err, pharmacy_order_add) => {
        if (!err) {
            res.render('pharmacy_order_add', {
                pharmacy_order_add,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", pharmacy_order_add);
    });
}

exports.medicine = (req, res) => {
    connection.query('SELECT * FROM medicine;', (err, medicine) => {
        if (!err) {
            res.render('medicine', {
                medicine,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", medicine);
    });
}

exports.medicine_search = (req, res) => {
    const {medicine_search} = req.body;
    let searchKey = req.body.search;

    connection.query('SELECT * FROM medicine WHERE medicine.barcode LIKE ? ' +
    'OR medicine.medicine_name LIKE ? ' +
    'OR medicine.active_substance LIKE ? ' +
    'OR medicine.form LIKE ? ' +
    'OR medicine.synonyms LIKE ? ' +
    'OR medicine.application LIKE ? ' +
    'OR medicine.use_method LIKE ? ' +
    'OR medicine.manufacturer LIKE ?;', 
    ['%' + medicine_search + '%',
     '%' + medicine_search + '%',
     '%' + medicine_search + '%',
     '%' + medicine_search + '%',
     '%' + medicine_search + '%',
     '%' + medicine_search + '%',
     '%' + medicine_search + '%',
     '%' + medicine_search + '%'], (err, medicine_search) => {
        if (!err) {
            res.render('medicine', {
                medicine_search,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", medicine_search);
    });
}

exports.medicine_add_form = (req, res) => {
    res.render('medicine_add', {
        layout: false
    });
}

exports.medicine_add = (req, res) => {
    const { barcode, medicine_name, active_substance, form, category, measure_units, synonyms, application, use_method, manufacturer } = req.body;
    let searchKey = req.body.search;

    connection.query('INSERT INTO medicine SET barcode = ?, ' +
    'medicine_name = ?, ' +
    'active_substance = ?, ' +
    'form = ?, ' +
    'category = ?, ' +
    'measure_units = ?, ' +
    'synonyms = ?, ' +
    'application = ?, ' +
    'use_method = ?, ' +
    'manufacturer = ?;', 
    [barcode, medicine_name, active_substance, form, category, measure_units, synonyms, application, use_method, manufacturer],
    (err, medicine_add) => {
        if (!err) {
            res.render('medicine_add', {
                medicine_add,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", medicine_add);
    });
}

exports.medicine_edit_form = (req, res) => {
    const medicine_id = req.params.medicine_id;

    connection.query('SELECT * FROM medicine WHERE medicine.medicine_id = ?;', [medicine_id], (err, medicine_edit) => {
        if (!err) {
            res.render('medicine_edit', {
                medicine_edit_form: medicine_edit[0],
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table edit-form: \n", medicine_edit);
    });
}

exports.medicine_edit = (req, res) => {
    const { barcode, medicine_name, active_substance, form, category, measure_units, synonyms, application, use_method, manufacturer } = req.body;

    connection.query('UPDATE medicine SET barcode = ?, medicine_name = ?, active_substance = ?, form = ?, category = ?, measure_units = ?, synonyms = ?, application = ?, use_method = ?, manufacturer = ? WHERE medicine.medicine_id = ?;', [barcode, medicine_name, active_substance, form, category, measure_units, synonyms, application, use_method, manufacturer, req.params.medicine_id], (err, medicine_edit) => {
        if (!err) {
            connection.query('SELECT * FROM medicine WHERE medicine.medicine_id = ?;', [req.params.medicine_id], (err, medicine_edit) => {
                if (!err) {
                    res.render('medicine_edit', {
                        medicine_edit,
                        layout: false
                    });
                }
                else {
                    console.log(err);
                }
                console.log("Data from the table update-1: \n", medicine_edit);
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table update-2: \n", medicine_edit);
    });
}

exports.medicine_delete = (req, res) => {
    const medicine_id = req.params.medicine_id;

    connection.query('DELETE FROM medicine WHERE medicine.medicine_id = ?;', [medicine_id], (err, medicine_delete) => {
        if (!err) {
            res.redirect('/medicine');
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", medicine_delete);
    });
}

exports.supplier = (req, res) => {
    connection.query('SELECT * FROM supplier;', (err, supplier) => {
        if (!err) {
            res.render('supplier', {
                supplier,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", supplier);
    });
}

exports.supplier_search = (req, res) => {
    const {supplier_search} = req.body;
    let searchKey = req.body.search;

    connection.query('SELECT * FROM supplier WHERE supplier.supplier_barcode LIKE ? ' +
    'OR supplier.supplier_name LIKE ? ' +
    'OR supplier.address LIKE ? ' +
    'OR supplier.phone_number LIKE ? ' +
    'OR supplier.email LIKE ? ' +
    'OR supplier.inn LIKE ?;',
    ['%' + supplier_search + '%',
     '%' + supplier_search + '%',
     '%' + supplier_search + '%',
     '%' + supplier_search + '%',
     '%' + supplier_search + '%',
     '%' + supplier_search + '%'], (err, supplier_search) => {
        if (!err) {
            res.render('supplier', {
                supplier_search,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", supplier_search);
    });
}

exports.supplier_add_form = (req, res) => {
    res.render('supplier_add', {
        layout: false
    });
}

exports.supplier_add = (req, res) => {
    const { supplier_barcode, supplier_name, address, phone_number, email, inn } = req.body;
    let searchKey = req.body.search;

    connection.query('INSERT INTO supplier SET supplier_barcode = ?, ' +
    'supplier_name = ?, ' +
    'address = ?, ' +
    'phone_number = ?, ' +
    'email = ?, ' +
    'inn = ?;',
    [supplier_barcode, supplier_name, address, phone_number, email, inn],
    (err, supplier_add) => {
        if (!err) {
            res.render('supplier_add', {
                supplier_add,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", supplier_add);
    });
}

exports.supplier_edit_form = (req, res) => {
    const supplier_id = req.params.supplier_id;

    connection.query('SELECT * FROM supplier WHERE supplier.supplier_id = ?;', [supplier_id], (err, supplier_edit) => {
        if (!err) {
            res.render('supplier_edit', {
                supplier_edit_form: supplier_edit[0],
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table edit-form: \n", supplier_edit);
    });
}

exports.supplier_edit = (req, res) => {
    const { supplier_barcode, supplier_name, address, phone_number, email, inn } = req.body;

    connection.query('UPDATE supplier SET supplier_barcode = ?, supplier_name = ?, address = ?, phone_number = ?, email = ?, inn = ? WHERE supplier.supplier_id = ?;', [supplier_barcode, supplier_name, address, phone_number, email, inn, req.params.supplier_id], (err, supplier_edit) => {
        if (!err) {
            connection.query('SELECT * FROM supplier WHERE supplier.supplier_id = ?;', [req.params.supplier_id], (err, supplier_edit) => {
                if (!err) {
                    res.render('supplier_edit', {
                        supplier_edit,
                        layout: false
                    });
                }
                else {
                    console.log(err);
                }
                console.log("Data from the table update-1: \n", supplier_edit);
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table update-2: \n", supplier_edit);
    });
}

exports.supplier_delete = (req, res) => {
    const supplier_id = req.params.supplier_id;

    connection.query('DELETE FROM supplier WHERE supplier.supplier_id = ?;', [supplier_id], (err, supplier_delete) => {
        if (!err) {
            res.redirect('/supplier');
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", supplier_delete);
    });
}

exports.storage = (req, res) => {
    connection.query('SELECT * FROM storage', (err, storage) => {
        if (!err) {
            res.render('storage', {
                storage,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", storage);
    });
}

exports.storage_search = (req, res) => {
    const { storage_search } = req.body;
    let searchKey = req.body.search;

    connection.query('SELECT * FROM storage WHERE storage.barcode LIKE ? ' +
    'OR storage.name LIKE ? ' +
    'OR storage.active_substance LIKE ? ' +
    'OR storage.synonyms LIKE ? ' +
    'OR storage.manufacturer LIKE ? ' +
    'OR storage.medicine_price LIKE ? ' +
    'OR storage.stock_amount LIKE ? ' +
    'OR storage.regulatory_balance LIKE ? ' +
    'OR storage.medicine_shelf_life LIKE ? ' +
    'OR storage.supplier_barcode LIKE ?;',
    ['%' + storage_search + '%',
     '%' + storage_search + '%',
     '%' + storage_search + '%',
     '%' + storage_search + '%',
     '%' + storage_search + '%',
     '%' + storage_search + '%',
     '%' + storage_search + '%',
     '%' + storage_search + '%',
     '%' + storage_search + '%',
     '%' + storage_search + '%'], (err, storage_search) => {
        if (!err) {
            res.render('storage', {
                storage_search,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", storage_search);
    });
}

exports.storage_add_form = (req, res) => {
    res.render('storage_add', {
        layout: false
    });
}

exports.storage_add = (req, res) => {
    const { barcode, name, active_substance, synonyms, manufacturer, medicine_price, discount, medicine_price_discount, stock_amount, regulatory_balance, medicine_shelf_life, supplier_barcode } = req.body;
    let searchKey = req.body.search;

    connection.query('INSERT INTO storage SET barcode = ?, ' +
    'name = ?, ' +
    'active_substance = ?, ' +
    'synonyms = ?, ' +
    'manufacturer = ?, ' +
    'medicine_price = ?, ' +
    'discount = ?, ' +
    'medicine_price_discount = ?, ' +
    'stock_amount = ?, ' +
    'regulatory_balance = ?, ' +
    'medicine_shelf_life = ?, ' +
    'supplier_barcode = ?;',
    [barcode, name, active_substance, synonyms, manufacturer, medicine_price, discount, medicine_price_discount, stock_amount, regulatory_balance, medicine_shelf_life, supplier_barcode],
    (err, storage_add) => {
        if (!err) {
            res.render('storage_add', {
                storage_add,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", storage_add);
    });
}

/*exports.storage_view_form = (req, res) => {
    res.render('storage_view', {
        layout: false
    });
}*/

exports.storage_view = (req, res) => {
    const storage_id = req.params.storage_id;

    connection.query('SELECT * FROM medicine INNER JOIN storage ON storage.medicine_id = medicine.medicine_id WHERE storage.storage_id = ?;', [storage_id], (err, storage_view) => {
        if (!err) {
            res.render('storage_view', {
                storage_view,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", storage_view);
    });
}

exports.storage_edit_form = (req, res) => {
    const storage_id = req.params.storage_id;

    connection.query('SELECT * FROM storage WHERE storage.storage_id = ?;', [storage_id], (err, storage_edit) => {
        if (!err) {
            res.render('storage_edit', {
                storage_edit_form: storage_edit[0],
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table edit-form: \n", storage_edit);
    });
}

exports.storage_edit = (req, res) => {
    const { barcode, name, active_substance, synonyms, manufacturer, medicine_price, discount, medicine_price_discount, stock_amount, regulatory_balance, medicine_shelf_life, supplier_barcode } = req.body;

    connection.query('UPDATE storage SET barcode = ?, name = ?, active_substance = ?, synonyms = ?, manufacturer = ?, medicine_price = ?, discount = ?, medicine_price_discount = ?, stock_amount = ?, regulatory_balance = ?, medicine_shelf_life = ?, supplier_barcode = ? WHERE storage.storage_id = ?;', [barcode, name, active_substance, synonyms, manufacturer, medicine_price, discount, medicine_price_discount, stock_amount, regulatory_balance, medicine_shelf_life, supplier_barcode, req.params.storage_id], (err, storage_edit) => {
        if (!err) {
            connection.query('SELECT * FROM storage WHERE storage.storage_id = ?;', [req.params.storage_id], (err, storage_edit) => {
                if (!err) {
                    res.render('storage_edit', {
                        storage_edit,
                        layout: false
                    });
                }
                else {
                    console.log(err);
                }
                console.log("Data from the table update-1: \n", storage_edit);
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table update-2: \n", storage_edit);
    });
}

exports.storage_delete = (req, res) => {
    const storage_id = req.params.storage_id;

    connection.query('DELETE FROM storage WHERE storage.storage_id = ?;', [storage_id], (err, storage_delete) => {
        if (!err) {
            res.redirect('/storage');
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", storage_delete);
    });
}

exports.internet_orders = (req, res) => {
    connection.query('SELECT * FROM client_order WHERE client_order.order_number <> 0;', (err, internet_orders) => {
        if (!err) {
            res.render('internet_orders', {
                internet_orders,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", internet_orders);
    });
}

exports.internet_orders_search = (req ,res) => {
    const { internet_orders_search } = req.body;
    let searchKey = req.body.search;

    connection.query('SELECT * FROM client_order WHERE client_order.order_number LIKE ? AND client_order.order_number <> 0 ORDER BY client_order.order_number; SELECT SUM(sum_price) AS total_price FROM client_order WHERE client_order.order_number = ?',
    [internet_orders_search, internet_orders_search], (err, internet_orders_search) => {
        if (!err) {
            res.render('internet_orders', {
                internet_orders_search,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", internet_orders_search[0]);
        console.log("Sum from the table: \n", internet_orders_search[1]);
    });
}

exports.internet_orders_search_delete = (req, res) => {
    const client_order_id = req.params.client_order_id;

    connection.query('DELETE FROM client_order WHERE client_order.client_order_id = ?;', [client_order_id], (err, internet_orders_search_delete) => {
        if (!err) {
            res.redirect('/internet_orders');
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", internet_orders_search_delete);
    });
}

exports.internet_orders_cheque_form = (req, res) => {
    const { order_number } = req.params.order_number;

    connection.query('UPDATE storage SET storage.stock_amount = IF (storage.stock_amount - client_order.medicine_amount >= 0, storage.stock_amount - client_order.medicine_amount, storage.stock_amount) WHERE client_order.order_number = ?;', [order_number], (err, internet_orders_cheque_form) => {
        if (!err) {
            res.render('internet_orders_cheque', {
                internet_orders_cheque_form,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", internet_orders_cheque_form);
    });
}

exports.new_order = (req, res) => {
    connection.query('SELECT * FROM storage', (err, new_order) => {
        if (!err) {
            res.render('new_order', {
                new_order,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", new_order);
    });
}

exports.new_order_search = (req, res) => {
    const { new_order_search } = req.body;
    let searchKey = req.body.search;

    connection.query('SELECT * FROM storage WHERE storage.barcode LIKE ? ' +
    'OR storage.name LIKE ? ' +
    'OR storage.active_substance LIKE ? ' +
    'OR storage.manufacturer LIKE ? ' +
    'OR storage.medicine_price LIKE ? ' +
    'OR storage.stock_amount LIKE ? ' +
    'OR storage.regulatory_balance LIKE ? ' +
    'OR storage.medicine_shelf_life LIKE ? ' +
    'OR storage.supplier_barcode LIKE ?;',
    ['%' + new_order_search + '%',
     '%' + new_order_search + '%',
     '%' + new_order_search + '%',
     '%' + new_order_search + '%',
     '%' + new_order_search + '%',
     '%' + new_order_search + '%',
     '%' + new_order_search + '%',
     '%' + new_order_search + '%',
     '%' + new_order_search + '%'], (err, new_order_search) => {
        if (!err) {
            res.render('new_order', {
                new_order_search,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", new_order_search);
    });
}

exports.new_order_add_form = (req, res) => {
    const storage_id = req.params.storage_id;

    connection.query('SELECT * FROM storage;', (err, new_order) => {
        if (!err) {
            res.render('new_order_add', {
                new_order_add_form: new_order[storage_id - 1],
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table new_order: \n", new_order);
    });
}

exports.new_order_add = (req, res) => {
    const storage_id = req.params.storage_id;

    connection.query('INSERT INTO client_order(medicine_barcode, medicine_name, category, medicine_price, discount, medicine_price_discount, storage_id, order_date) ' +
    'SELECT storage.barcode, storage.name, storage.category, storage.medicine_price, storage.discount, storage.medicine_price_discount, storage.storage_id, CURDATE() FROM storage WHERE storage_id = ?; ' +
    'UPDATE client_order SET client_order.status = "Не оплачено" WHERE client_order.order_number IS NULL; ' +
    'UPDATE client_order SET client_order.medicine_amount = 1 WHERE client_order.order_number IS NULL;', [storage_id], (err, new_order_add) => {
        if (!err) {
            connection.query('SELECT * FROM client_order WHERE order_number = NULL', (err, new_order_add) => {
                if (!err)
                {
                    res.render('new_order_add', {
                        new_order_add,
                        layout: false
                    });
                }
                else {
                    console.log(err);
                }
                console.log("Data from the table insert-1: \n", new_order_add);
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table insert-2: \n", new_order_add);
    });
}

exports.new_order_cheque = (req, res) => {
    connection.query('SELECT * FROM client_order WHERE order_number IS NULL;', (err, new_order_cheque) => {
        if (!err) {
            res.render('new_order_cheque', {
                new_order_cheque,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", new_order_cheque);
    });
}

exports.new_order_change_amount_form = (req, res) => {
    const client_order_id = req.params.client_order_id;

    connection.query('SELECT * FROM client_order WHERE client_order.client_order_id = ?;', [client_order_id], (err, new_order_change_amount) => {
        if (!err) {
            res.render('new_order_change_amount', {
                new_order_change_amount_form: new_order_change_amount[0],
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table edit-form: \n", new_order_change_amount);
    });
}

exports.new_order_change_amount = (req, res) => {
    const client_order_id = req.params.client_order_id;
    const { medicine_amount } = req.body;

    connection.query('UPDATE client_order SET client_order.medicine_amount = ? WHERE client_order.client_order_id = ?', [medicine_amount, client_order_id], (err, new_order_change_amount) => {
        if (!err) {
            connection.query('SELECT * FROM client_order WHERE client_order.client_order_id = ?', [client_order_id], (err, new_order_change_amount) => {
                if (!err) {
                    res.render('new_order_change_amount', {
                        new_order_change_amount,
                        layout: false
                    });
                }
                else {
                    console.log(err);
                }
                console.log("Data from change amount-1: \n", new_order_change_amount);
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from change amount-2: \n", new_order_change_amount);
    });
}

exports.new_order_cheque_result = (req, res) => {
    connection.query('UPDATE client_order SET client_order.sum_price = client_order.medicine_price * client_order.medicine_amount WHERE client_order.order_number IS NULL;' +
    'SELECT * FROM client_order WHERE client_order.order_number IS NULL;' +
    'SELECT SUM(sum_price) AS total_price FROM client_order WHERE client_order.order_number IS NULL;' +
    'UPDATE client_order SET client_order.order_number = FLOOR(RAND()*(9999-1000+1)+1000) WHERE client_order.order_number IS NULL;', (err, new_order_cheque_result) => {
        if (!err) {
            res.render('new_order_cheque_result', {
                new_order_cheque_result,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", new_order_cheque_result);
    });
}

/*exports.new_order_cheque = (req, res) => {
    connection.query('INSERT INTO client_order(status) "Не оплачено" WHERE client_order.order_number IS NULL;' +
    'INSERT INTO client_order(medicine_amount) 1 WHERE client_order.order_number IS NULL;', (err, new_order_cheque) => {
        if (!err) {
            res.render('new_order_cheque_result', {
                new_order_cheque,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", new_order_cheque);
    });
}*/

/*exports.storage_edit_form = (req, res) => {
    const storage_id = req.params.storage_id;

    connection.query('SELECT * FROM storage WHERE storage.storage_id = ?;', [storage_id], (err, storage_edit) => {
        if (!err) {
            res.render('storage_edit', {
                storage_edit_form: storage_edit[0],
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table edit-form: \n", storage_edit);
    });
}

exports.storage_edit = (req, res) => {
    const { barcode, name, active_substance, synonyms, manufacturer, medicine_price, discount, medicine_price_discount, stock_amount, regulatory_balance, medicine_shelf_life, supplier_barcode } = req.body;

    connection.query('UPDATE storage SET barcode = ?, name = ?, active_substance = ?, synonyms = ?, manufacturer = ?, medicine_price = ?, discount = ?, medicine_price_discount = ?, stock_amount = ?, regulatory_balance = ?, medicine_shelf_life = ?, supplier_barcode = ? WHERE storage.storage_id = ?;', [barcode, name, active_substance, synonyms, manufacturer, medicine_price, discount, medicine_price_discount, stock_amount, regulatory_balance, medicine_shelf_life, supplier_barcode, req.params.storage_id], (err, storage_edit) => {
        if (!err) {
            connection.query('SELECT * FROM storage WHERE storage.storage_id = ?;', [req.params.storage_id], (err, storage_edit) => {
                if (!err) {
                    res.render('storage_edit', {
                        storage_edit,
                        layout: false
                    });
                }
                else {
                    console.log(err);
                }
                console.log("Data from the table update-1: \n", storage_edit);
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table update-2: \n", storage_edit);
    });
}*/

/*exports.internet_orders_cheque = (req, res) => {
    const {internet_orders_cheque} = req.body;

    connection.query('SELECT * FROM client_order WHERE client_order.order_number LIKE ? AND client_order.order_number <> 0 ORDER BY client_order.order_number; SELECT SUM(sum_price) AS total_price FROM client_order WHERE client_order.order_number = ?'),
    [internet_orders_cheque, internet_orders_cheque], (err, internet_orders_cheque) => {
        if (!err) {
            res.render('internet_orders_cheque', {
                internet_orders_cheque,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", internet_orders_cheque[0]);
        console.log("Sum from the table: \n", internet_orders_cheque[1]);
    }
}*/

/*exports.internet_orders_edit_form = (req, res) => {
    const medicine_id = req.params.medicine_id;

    connection.query('SELECT * FROM medicine WHERE medicine.medicine_id = ?;', [medicine_id], (err, medicine_edit) => {
        if (!err) {
            res.render('medicine_edit', {
                medicine_edit_form: medicine_edit[0],
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table edit-form: \n", medicine_edit);
    });
}*/

/*exports.medicine_edit = (req, res) => {
    const barcode = req.body.barcode;
    const medicine_name = req.body.medicine_name;
    const active_substance = req.body.active_substance;
    const form = req.body.form;
    const category = req.body.category;
    const measure_units = req.body.measure_units;
    const application = req.body.application;
    const use_method = req.body.use_method;
    const manufacturer = req.body.manufacturer;
    const medicine_id = req.body.medicine_id;

    connection.query('UPDATE medicine SET barcode = ?, ' +
    'medicine_name = ?, ' +
    'active_substance = ?, ' +
    'form = ?, ' +
    'category = ?, ' +
    'measure_units = ?, ' +
    'application = ?, ' +
    'use_method = ?, ' +
    'manufacturer = ? ' +
    'WHERE medicine.medicine_id = ? ', [barcode, medicine_name, active_substance, form, category, measure_units, application, use_method, manufacturer, medicine_id], (err, medicine_edit) => {
        if (!err) {
            res.render('medicine_edit', {
                medicine_edit,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table update: \n", medicine_edit);
    });
    res.redirect('/medicine');
}*/

/*exports.storage_add_select = (req, res) => {
    const medicine_id = req.params.medicine_id;

    connection.query('SELECT * FROM medicine WHERE NOT EXISTS (SELECT storage.storage_id FROM storage WHERE storage.? = medicine.?)', [medicine_id], (err, storage_add_select) => {
        if (!err) {
            res.render('storage_add', {
                storage_add_select,
                layout: false
            });
        }
        else {
            console.log(err);
        }
        console.log("Data from the table: \n", storage_add_select);
    });
}*/