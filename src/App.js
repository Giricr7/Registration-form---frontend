import './App.css';
import Registration_form from './registrationForm';
import DataTable from './DataTable'
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';

// base url
axios.defaults.baseURL='http://localhost:5000'

function App() {

  // common state variables
  const [ftColour, setFtColour] = useState('secondary');
  const [ptColour, setPtColour] = useState('inherit');
  const [consultColour, setConsultColour] = useState('inherit');
  const [selectedImage, setSelectedImage] = useState('');
  const [dob, setDob] = useState(new Date());
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [jobType, setJobType] = useState('Full Time');
  const [location, setLocation] = useState([]);
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [btnVisibility, setBtnVisibility] = useState(true);
  
  
  
  // editing function
  let setDataForEditing = ({name,email,mobile,dob,location,jobType,}) => {
    setBtnVisibility(false)
    setName(name);
    setEmail(email);
    setMobile(mobile);
    setDob(dob);
    setJobType(jobType);
    SetJobTypeClr(jobType);
    setLocation(location.split(','));
  }


  // deleting function 
  let handleDelete = async(email) => {
    
    let result = await axios.delete(`/deleteUser/${email}`)

    if (result.data.msg === 'user deleted') {
      console.log(userData)
      let alteredData = await axios.get('/getUsers')


        let data = alteredData.data.map((user) => {
        
          return (
           
           {
             name: user.name, email: user.email, mobile: `+${user.mobile}`, dob: moment(user.dob).format("DD/MM/YYYY"), jobType: user.jobType, location: user.location,
             action: <div><span>Image</span> | <span onClick={() => setDataForEditing({
               name: user.name,
               email: user.email,
               mobile: user.mobile,
               dob: user.dob,
               jobType: user.jobType,
               location: user.location,
               image: user.selectedImage
             })}>Edit</span> | <span onClick={()=>handleDelete(user.email)}>Delete</span></div>
           }
         )
        })

      setUserData(data);
      Swal.fire({
        icon: 'success',
        title: 'Good job',
        text: 'User deleted Successfully'
      })

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Deletion Failed',
        text: 'Server Error'
      })
    }
  }


  //jobs input toggler
    const SetJobTypeClr = (value) => {
        
    

      switch (value) {
        
        case 'Full Time': {
          setFtColour('secondary');
          setPtColour('inherit');
          setConsultColour('inherit');
          setJobType('Full Time')
          break;
        }
        case 'Part Time': {
          setFtColour('inherit');
          setPtColour('secondary');
          setConsultColour('inherit');
          setJobType('Part Time');
          break;
        }
        case 'Consultant': {
          setFtColour('inherit');
          setPtColour('inherit');
          setConsultColour('secondary');
          setJobType('Consultant');
          break;
        }
        default: {
          setFtColour('secondary');
          setPtColour('inherit');
          setConsultColour('inherit');
          setJobType('Full Time');
        }
      }


    }
  
  return (

    
    <div className="App">
      
      {/* form section  */}
      <div>
        <Registration_form 

          SetJobTypeClr={SetJobTypeClr}
          ftColour={ftColour}
          setFtColour={setFtColour}
          ptColour={ptColour}
          setPtColour={setPtColour}
          consultColour={consultColour}
          setConsultColour={setConsultColour}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          dob={dob}
          setDob={setDob}
          jobType={jobType}
          setJobType={setJobType}
          name={name}
          setName={setName}
          mobile={mobile}
          setMobile={setMobile}
          location={location}
          setLocation={setLocation}
          email={email}
          setEmail={setEmail}
          open={open}
          setOpen={setOpen}
          setDataForEditing={setDataForEditing}
          userData={userData}
          setUserData={setUserData}
          handleDelete={handleDelete}
          btnVisibility={btnVisibility}
          setBtnVisibility={setBtnVisibility}
      />
      </div>


{/* table section        */}
      <div>
        <DataTable

          SetJobTypeClr={SetJobTypeClr}
          setSelectedImage={setSelectedImage}
          setDob={setDob}
          setJobType={setJobType}
          setName={setName}
          setMobile={setMobile}
          setLocation={setLocation}
          setEmail={setEmail}
          userData={userData}
          setUserData={setUserData}
          setDataForEditing={setDataForEditing}
          handleDelete={handleDelete}
          setBtnVisibility={setBtnVisibility}
        />
      </div>
    </div>
  );
}

export default App;
