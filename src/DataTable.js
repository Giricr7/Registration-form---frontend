import React, { useState,useEffect } from 'react';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import 'rsuite-table/dist/css/rsuite-table.css'; 
import axios from 'axios';
import moment from 'moment';


function DataTable(props) {

  // state variables 
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  

  // fetching data from DB to insert into table 
  useEffect(() => {
    console.log("DT useeffect")

     let result
     let fetchData = async () => {
      result = await axios.get('/getUsers');
       
       

       let data = result.data.map((user) => {
        
         return (
          
          {
            name: user.name, email: user.email, mobile: `+${user.mobile}`, dob: moment(user.dob).format("DD/MM/YYYY"), jobType: user.jobType, location: user.location,
            action: <div><span>Image</span> | <span onClick={() => props.setDataForEditing({
              name: user.name,
              email: user.email,
              mobile: user.mobile,
              dob: user.dob,
              jobType: user.jobType,
              location: user.location,
              image: user.selectedImage
            })}>Edit</span> | <span onClick={()=>props.handleDelete(user.email)}>Delete</span></div>
          }
        )
       })
       
       props.setUserData(data);
    }
    fetchData()
    

    },[])

  
  
    

// data array for table and sorting
  const getData = () => {

    if (sortColumn && sortType) {

      
      return props.userData.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];

        
        if (typeof x === 'string') {
          if (sortColumn === 'mobile') {
            x = x.charCodeAt(4);
          } else if (sortColumn === 'dob') {
            x = new Date(x);
          } else {
            x = x.charCodeAt();
          }
          
        }
        if (typeof y === 'string') {
          if (sortColumn === 'mobile') {
            y = y.charCodeAt(4);
          }else if (sortColumn === 'dob') {
            y = new Date(y);
          } else {
            y = y.charCodeAt();
          }
        }
        if (sortType === 'asc') {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    
    return (props.userData)

  };

  // sort handler 
  const handleSortColumn = (sortColumn, sortType) => {
    
      setSortColumn(sortColumn);
      setSortType(sortType);
      
  };


  


  return (
    <div className='table_main_div'>
      <Table
        wordWrap
        affixHorizontalScrollbar
        height={420}
        data={
          getData()
        }
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
      >
        {/* Name column  */}
      <Column width={200} align="center" fixed sortable>
        <HeaderCell>Name</HeaderCell>
        <Cell dataKey="name" className='tr' />
      </Column>

        {/* email column  */}
      <Column width={200} sortable resizable>
        <HeaderCell>Email</HeaderCell>
        <Cell dataKey="email"  className='tr'/>
      </Column>
         {/* Mobile column  */}
      <Column width={150} sortable resizable>
        <HeaderCell>Mobile</HeaderCell>
        <Cell dataKey="mobile" className='tr' />
      </Column>
        {/* DOB column  */}
      <Column width={200} sortable resizable>
        <HeaderCell>DOB</HeaderCell>
        <Cell dataKey="dob"  className='tr'/>
      </Column>
        {/* Job Type column  */} 
      <Column width={200} sortable resizable>
        <HeaderCell>Job Type</HeaderCell>
        <Cell dataKey="jobType" className='tr' />
        </Column>
        {/* Pref. Location column  */} 
        <Column width={200} sortable resizable>
        <HeaderCell>Pref. Location</HeaderCell>
        <Cell dataKey="location" className='tr' />
        </Column>
        {/* Action column  */}
        <Column width={200} >
        <HeaderCell>Action</HeaderCell>
        <Cell dataKey="action" className='tr' />
      </Column>

    </Table>



    </div>
  )
}

export default DataTable