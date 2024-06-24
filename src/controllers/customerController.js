const Customer = require("../models/customer");
const Vehicle = require("../models/vehicle");
const Appointment = require("../models/appoinment");


exports.getAllCustomers = async (req, res) => {
    try {
        // Get all customers
        const customers = await Customer.find({ role: 'customer'}).lean();

        // Fetch details for each customer
        const customersWithDetails = await Promise.all(
            customers.map(async (customer) => {
                // Get vehicle information for the customer
                const vehicle = await Vehicle.findOne({ owner: customer._id });

                // Count the number of appointments for the customer
                const appointmentCount = await Appointment.countDocuments({ customerId: customer._id });

                // Get vehicle information from appointment table
                const appointments = await Appointment.find({ customerId: customer._id }).select('vehicleType vrNo');

                return {
                    ...customer,
                    vehicle,
                    appointmentCount,
                    appointments
                };
            })
        );

        res.status(200).send(customersWithDetails);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
};
//get suppliers
exports.fetchSuppliers = async (req, res) => {
    try {
        const suppliers = await Customer.find({ role: 'supplier' }, 'name email'); // Fetch name and email
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add customer (just to test)
exports.createCustomer = async (req, res) => {
    console.log(req.body);
    const customer = new Customer(req.body);

    try {
        await customer.save();
        res.status(201).send(customer);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Toggle customer status
exports.toggleCustomerStatus = async (req, res) => {
    try {
        const { customerId } = req.params;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Toggle status
        customer.status = customer.status === "active" ? "deactivated" : "active";
        await customer.save();

        res.status(200).json({ message: "Customer status updated successfully", customer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
//cus count
exports.getCustomerCount = async (req, res) => {
    try {
        const count = await Customer.countDocuments({ status: "active" , role: 'customer'});
        res.status(200).json({ count });
    } catch (error) {
        res.status(400).send(error);
    }
};

// //add customer
// router.post("/users",async(req,res)=>{

//     // console.log(req.body);
//     const user = new User(req.body);

//     try {
//         await user.save();  
//         res.status(201).send(user)
//     } catch (error) {
//         res.status(400).send(error)       
//     }
// });

//add customer 
exports.addCustomer = async (req, res) => {
    console.log(req.body);
    const customer = new Customer(req.body);


    try {
        await customer.save();
        res.status(201).send(customer);
    } catch (error) {
        res.status(400).send(error);
    }
};

// //get all customers userprofile
// exports.getCustomerprofile = async (req, res) => {
//     // console.log(req.body);
//     // const customer = new Customer(req.body);

//     try {
//         const customer = await Customer.find({});
//         res.status(201).send(customer);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// };


 
 //get specific user detail for userprofile
 // and for appointment form details
 //exports.getOneCusprofile = async (req, res) => {

//get specific user detail for userprofile
exports.getOneCusprofile = async (req, res) => {

    //  router.get("/users/:id",async(req,res)=>{
    const _id = req.params.id;


    try {
        const customer = await Customer.findById(_id)
        // const customer = await Customer.find()

        if (!customer) {
            return res.status(404).send
        }
        res.status(201).send(customer)
    } catch (error) {
        res.status(400).send(error)
    }
};


//Update userProfile
exports.updateProfile = async (req, res) => {

    // router.put("/users/:id",async(req,res)=>{
    const _id = req.params.id;

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(_id, req.body, { new: true })

        if (!updatedCustomer) {
            return res.status(404).send()
        }

        res.status(200).send(updatedCustomer)
    } catch (error) {
        res.status(400).send(error)
    }
};





