import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import LocationSelector from './LocationSelector';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { AiFillFileAdd } from 'react-icons/ai';
import { MdOutlineSystemUpdateAlt } from 'react-icons/md';
import validator from 'validator';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Collapse from '@mui/material/Collapse';
import moment from 'moment';
import Swal from 'sweetalert2';



function RegistrationForm(props) {
  
  // state variable 
  const [msg, setMsg] = useState('')
     

  const Input = styled('input')({
    display: 'none',
  });
    
  const handleChange = (newValue) => {
    props.setDob(newValue);
  };
  
  // mobile number validation 
  const validatePhoneNumber = (number) => {
    const isValidPhoneNumber = validator.isMobilePhone(number)
    return (isValidPhoneNumber)
  }

  // inputs validation
  let Validate = (name, email, mobile, dob, location, image) => {
    const mobileResult = validatePhoneNumber(mobile);
    console.log(location.length)
    if (!name) {
      props.setOpen(true)
      setMsg('Invalid Entry - "Name" field')
    } else if (!email) {
      props.setOpen(true)
      setMsg('Invalid Entry - "mail" field')
    } else if (!mobileResult) {
      props.setOpen(true)
      setMsg('Invalid Entry - "mobile" field')
    } else if (moment(dob).format('L') === moment(new Date()).format('L')) {
      props.setOpen(true)
      setMsg('Invalid Entry - "DOB" field')
    } else if (location.length === 0) {
      props.setOpen(true)
      setMsg('Invalid Entry - "Preferred Location" field')
    } else if (!image) {
      props.setOpen(true)
      setMsg('Invalid Entry - "image" field')
    } else {
      return true
    }
    
  }

  // clearing the state variables after submission
  let clearForm = () => {
    props.setName('');
    props.setEmail('');
    props.setFtColour('secondary');
    props.setPtColour('inherit');
    props.setConsultColour('inherit');
    props.setDob(new Date());
    props.setMobile('');
    props.setJobType('');
    props.setLocation([]);
    props.setSelectedImage('');
    props.setOpen(false);

  }

  // update button handler
  let handleUpdate = async (e) => {
    e.preventDefault();

    let result = Validate(props.name, props.email, props.mobile, props.dob, props.location, props.selectedImage);
    if (!result) {
      console.log('validation failed')
    } else {
        
      const response = await axios.put('/modifyUser', {
        name: props.name,
        mobile: props.mobile,
        dob: props.dob,
        jobType: props.jobType,
        location: props.location,
        image: props.selectedImage
      })
     
         
      if (response.data.msg === 'user updated') {
        Swal.fire({
          icon: 'success',
          title: 'Good job',
          text: 'User Updated Successfully'
        })

        let index=props.userData.findIndex((user) => {
          return user.email === props.email;

        })

      
      props.userData[index]={
        name: props.name, email: props.email, mobile: `+${props.mobile}`, dob: moment(props.dob).format("DD/MM/YYYY"), jobType: props.jobType, location: props.location,
        action: <div><span>Image</span> | <span onClick={() => props.setDataForEditing({
          name: props.name,
          email: props.email,
          mobile: props.mobile,
          dob: props.dob,
          jobType: props.jobType,
          location: props.location,
          image: props.selectedImage
        })}>Edit</span> | <span onClick={()=>props.handleDelete(props.email)}>Delete</span></div>
      }
     
        props.setUserData(props.userData);
        props.setBtnVisibility(true);
        clearForm();
        e.target.reset();
        
    } else if (response.data.msg === 'user updation unsuccessfull') {
      Swal.fire({
        icon: 'error',
        title: 'Updation Failed',
        text: 'Server Error'
      })
    }
  }
  }
    
  //submit button handler
    let handleSubmit = async (e) => {
      e.preventDefault();
    
      let result = Validate(props.name, props.email, props.mobile, props.dob, props.location, props.selectedImage);
      if (!result) {
        console.log('validation failed')
      } else {
        
        const response = await axios.post('/adduser', {
          name: props.name,
          email: props.email,
          mobile: props.mobile,
          dob: props.dob,
          jobType: props.jobType,
          location: props.location,
          image: props.selectedImage
        })
        console.log(response.data.msg)
         
        if (response.data.msg === 'user registered') {
          Swal.fire({
            icon: 'success',
            title: 'Good job',
            text: 'User Registered Successfully'
          })
          
          props.userData.push({
            name: props.name, email: props.email, mobile: `+${props.mobile}`, dob: moment(props.dob).format("DD/MM/YYYY"), jobType: props.jobType, location: props.location,
            action: <div><span>Image</span> | <span onClick={() => props.setDataForEditing({
              name: props.name,
              email: props.email,
              mobile: props.mobile,
              dob: props.dob,
              jobType: props.jobType,
              location: props.location,
              image: props.selectedImage
            })}>Edit</span> | <span onClick={()=>props.handleDelete(props.email)} >Delete</span></div>
          })
         
          props.setUserData(props.userData);
          clearForm();
          e.target.reset();
        } else if (response.data.msg === 'user already exists') {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Entry',
            text: 'Email already exists'
          })
        }
     
      
      }
    }
  
    return (
      <div className='form_main_div'>
        
        {/* alert  */}
        <Collapse in={props.open}>
          <Alert severity="error"
          >
            <AlertTitle>Error</AlertTitle>
            {msg} — <strong>check it out!</strong>
          </Alert>
        </Collapse>
        <form >
          <fieldset>
            <legend>Registration</legend>
                            
            <div className='form_inner_div'>
              
              {/* --------------------------------left hand side  */}
              <div className='form_left'>
                          
                {/* name field */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <label>Full Name</label>
                  </div>
                  <TextField
                    id="outlined-basic"
                    label="Full Name"
                    variant="outlined"
                    value={props.name}
                    sx={{
                      width: 300
                    }}
                    onChange={(e) => {
                      props.setName(e.target.value)
                    }}
                                    
                                    
                  />
                </div>
                          
                <br /> <br />
                          
                {/* mobile field */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <label>Mobile</label>
                  </div>
                  <PhoneInput
                    country={'in'}
                    style={{ width: '10%' }}
                    value={props.mobile}
                    onChange={phone => {
                      props.setMobile(phone)
                    }}
                    inputProps={{
                      required: true
                    }}
                                
                  />
                </div>
                          
                <br /><br />
                          
                {/* job type field */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <label>Job Type</label>
                  </div>
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                    color='inherit'
                  >
                    <Button color={props.ftColour} value='Full Time' onClick={(e) => { props.SetJobTypeClr(e.target.value) }}>FT</Button>
                    <Button color={props.ptColour} value='Part Time' onClick={(e) => { props.SetJobTypeClr(e.target.value) }} >PT</Button>
                    <Button color={props.consultColour} value='Consultant' onClick={(e) => { props.SetJobTypeClr(e.target.value) }} >Consultant</Button>
                  </ButtonGroup>
                </div>

                <br /><br />
                          
                {/* preferred location filed */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <label>Pref. Location</label>
                  </div>
                             
                  <LocationSelector
                    location={props.location}
                    setLocation={props.setLocation}

                  />
                </div>
                     
              </div>


              {/* --------------------------------right hand side  */}


              <div className='form_right'>
                          
              {/* image field */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <label>Profile Pic</label>
                  </div>
                  <div className='image_div'>
                    {props.selectedImage && (
                      <div>
                                          
                        <img alt="not fount" width={"150px"} src={URL.createObjectURL(props.selectedImage)} />
                                                     
                      </div>
                    )} &nbsp; &nbsp;&nbsp;&nbsp;
    
                    <label htmlFor="icon-button-file">
                      <Input
                        accept="image/*"
                        id="icon-button-file"
                        type="file"
                        onChange={(event) => {
                          props.setSelectedImage(event.target.files[0]);
                          console.log(event.target.files[0])
                        }}
                      />
                      <IconButton color="primary" aria-label="upload picture" component="span">
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </div>
                </div>
                        
                <br />  <br />
                        
                   {/* email field         */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <label>Email</label>
                  </div>
                  <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    sx={{
                      width: 300
                    }}
                    disabled={!props.btnVisibility}
                    value={props.email}
                    type='email'
                    inputMode='email'
                    onChange={(e) => {
                                   
                      props.setEmail(e.target.value)
                    }}
                  />
                </div>

                          
                <br /> <br />
                          
                    {/* DOB field  */}
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <label>DOB</label>
                  </div>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      label="Date of Birth"
                      inputFormat="MM/dd/yyyy"
                      value={props.dob}
                      onChange={handleChange}
                      renderInput={(params) => <TextField {...params} sx={{
                        width: 300
                      }}
                                

                      />}
                    />
                  </LocalizationProvider>
                </div>



              </div>

                      
                     
            </div>
            <br /><br />
                  {/* add button */}
            <div className='submit_div'>
              {props.btnVisibility && <Button
                variant="contained"
                style={{ borderRadius: '20px' }}
                color='success'
                type='submit'
                onSubmit={(e) => handleSubmit(e)}
                hidden
              >
                          
                <AiFillFileAdd
                  style={{ fontSize: '25px' }}
                /> &nbsp;&nbsp;&nbsp;add</Button>
              }

                      {/* update button  */}
              {!props.btnVisibility && <Button
                variant="contained"
                style={{ borderRadius: '20px' }}
                color='primary'
                type='submit'
                onClick={(e) => handleUpdate(e)}
              >
                          
                <MdOutlineSystemUpdateAlt
                  style={{ fontSize: '25px', borderColor: 'white' }}
                /> &nbsp;&nbsp;&nbsp;update</Button>}
            </div>

          </fieldset>
        </form>

          
      </div>
    )
  
  
}
    export default RegistrationForm;