const Appointment = require('../models/appoinment');
const { format } = require('date-fns');

//update alert status
exports.alertStatus=async(req,res)=>{
  const { appointmentId } = req.body;

  try {
    // Update the alert status of the appointment to 'Sent'
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { t_alertStatus: 'Sent' },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Return success response with the updated appointment
    res.status(200).json({ message: 'Alert status updated', updatedAppointment });
  } catch (error) {
    console.error('Error updating alert status', error);
    res.status(500).json({ error: 'Error updating alert status' });
  }
}
//get appointment by next S_date( for Time based alerts-no)
exports.getAppointmentsByN_SDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required' });
    }
    //check whether date obj is valid
    const startDate = new Date(date);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    const appointments = await Appointment.find({
      nextS_date: {
        $gte: startDate,
        $lt: endDate
      }
    }).populate('customerId'); // Populate customerId instead of appointmentId

    res.json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};


//get appointmnet by date// get appointments by date
exports.getAppointmentsByDate = async (req, res) => {
    try {
      const { date } = req.query;  // Expecting date in 'YYYY-MM-DD' format
  
      if (!date) {
        return res.status(400).json({ error: 'Date query parameter is required' });
      }
  
      // Query appointments where the date matches the provided date string exactly
      const appointments = await Appointment.find({
        date: date  // Match the date string directly
      }).populate('customerId');  // Assuming customerId is the correct field to populate
  
      // Send the fetched appointments back as JSON
      res.json({ appointments });
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  


//up next s date
exports.updateNextServiceDate = async (req, res) => {
  try {
      const { vehicle_no } = req.params;
      const { nextS_date } = req.body;

      const appointment = await Appointment.findOneAndUpdate(
        { vrNo: vehicle_no },
        { $set: { nextS_date } },
          { new: true }
      );

      if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
      }

      res.json(appointment);
  } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
exports.appoinmentCount = async (req, res) => {
  try {
    const now = new Date();
    const currentDate = formatDate(now); // Format current date in MM/DD/YYYY

    // Fetch appointments and filter those occurring after the current date
    const appointments = await Appointment.find();

    const filteredAppointments = appointments.filter(appointment => {
      const appointmentDate = formatDate(new Date(appointment.date));
      return appointmentDate > currentDate;
    });

    const count = filteredAppointments.length;

    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//count
exports.appoinmentCount = async (req, res) => {
  try {
    const now = new Date();
    const currentDate = formatDate(now); // Format current date in MM/DD/YYYY

    // Fetch appointments and filter those occurring after the current date
    const appointments = await Appointment.find();

    const filteredAppointments = appointments.filter(appointment => {
      const appointmentDate = formatDate(new Date(appointment.date));
      return appointmentDate > currentDate;
    });

    const count = filteredAppointments.length;

    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// for analysis
exports.appoinmentCountforanalysis = async (req, res) => {
  try {
    const now = new Date();
    const currentDate = formatDate(now); // Format current date in MM/DD/YYYY

    // Fetch appointments and filter those occurring after the current date
    const appointments = await Appointment.find();



    // for tommorow
    const filteredAppointmentsfortomorow = appointments.filter(appointment => {
      const appointmentDate = formatDate(new Date(appointment.date));
      return appointmentDate > currentDate;
    })
    const appointmentDatestomorow = filteredAppointmentsfortomorow.map(appointment => ({
      date: formatDate(new Date(appointment.date)),
      serviceType: appointment.serviceType, 
    }));
    const counttomorow = filteredAppointmentsfortomorow.length;


    // for today
    const filteredAppointments = appointments.filter(appointment => {
      const appointmentDate = formatDate(new Date(appointment.date));
      return appointmentDate === currentDate;
    });
    const appointmentDetails = filteredAppointments.map(appointment => ({
      date: formatDate(new Date(appointment.date)),
      serviceType: appointment.serviceType, 
    }));
    const count = filteredAppointments.length;

    res.status(200).json({ 
      count, 
      appointmentDetails,
      counttomorow,
      appointmentDatestomorow,
      appointments,
      filteredAppointmentsfortomorow,
      filteredAppointments
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// Helper function to format date in MM/DD/YYYY format
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${month}/${day}/${year}`;
}

//below are kasun's
// for rewarding
exports.appoinmentCountforReward = async (req, res) => {
  try {
      const customerId = req.params.id;

        const count = await Appointment.countDocuments({customerId:customerId});
        res.status(200).json({ count });
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while counting appointments.' });
      }
};

// Create a new 
exports.gettimeforappointment = async (req, res) => {
  const date = req.query.date;
    const appointments = await Appointment.find({ date });
    res.json(appointments);
};


exports.createAppoinment = async (req, res) => {
    // console.log(req.body);
    const appoinment = new Appointment(req.body);

    try {
        await appoinment.save();
        res.status(201).send(appoinment);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getappointment = async (req, res) => {

  //  router.get("/users/:id",async(req,res)=>{
      const _id = req.params.id;
  
  
      try {
        // find the relevant appointments releated to the one customer
          const appointment = await Appointment.find({customerId:_id})
          // const appointment = await appointment.find()
          if(!appointment){
              return res.status(404).send
          }
          res.status(201).send(appointment)
      } catch (error) {
          res.status(400).send(error)
      }
  };

//cancel appointment
  exports.updateAppointmentStatus = async (req, res) => {
    const appointmentId = req.params.id;
    const { status } = req.body;
  
    try {
      const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, { status: status }, { new: true });
  
      if (!updatedAppointment) {
        return res.status(404).send({ message: 'Appointment not found' });
      }
  
      res.status(200).send(updatedAppointment);
    } catch (error) {
      res.status(400).send({ message: 'Error updating appointment status', error });
    }
  };

  //reshedule appointmnet
  exports.resheduleAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    const { timeSlot,date } = req.body;
  
    try {
      const resheduleAppointment = await Appointment.findByIdAndUpdate(appointmentId, { timeSlot:timeSlot,date:date}, { new: true });
  
      if (!resheduleAppointment) {
        return res.status(404).send({ message: 'Appointment not found' });
      }
  
      res.status(200).send(resheduleAppointment);
    } catch (error) {
      res.status(400).send({ message: 'Error resheduling appointment ', error });
    }
  };
