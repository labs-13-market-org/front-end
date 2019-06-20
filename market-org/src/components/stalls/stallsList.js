import React, { useEffect, useState } from "react";
import styled from "styled-components";

import axios from "../../axios-instance";
import Stall from "./stall.js";
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import "./stallsList.css"

// {
//     // "id": 0,
//     // "size": {
//     // },
//     // "market_id": "",
//     // "available": false,
//     // "qty": 0
// }

const StallsContainer = styled.div` 
    width: 1250px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;


`

const StallCard = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around; 
`

const PropertiesCard = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between; 
    width: 66%
`

const StallsList = (props) => {

    const [stalls, setStalls] = useState([]);
    const [market, setMarket] = useState({})
    const [hasAStallChanged, setStallChangeStatus] = useState(false);

    // useEffect(() => {
    //     axios.get(`/stalls/market/${props.location.state.firebase_id}`)
    //     .then(res => {
    //         console.log("Stalls : ", res.data)
    //         let stallItems = res.data.stallData;
    //         // stalls = stalls.map(stall => JSON.parse(stall));
    //        setStalls(stallItems);
    //         console.log("stalls", stalls);
    //        setStallChangeStatus(false);
    //     }).catch(err => {
    //             console.log(err.message);
    //     })


    // }, [hasAStallChanged]);

    useEffect(() => {
        axios.get(`/stalls/market/${props.location.state.firebase_id}`)
        .then(res => {
            console.log("Stalls : ", res.data)
            let stallItems = res.data.stallData;
            const market = res.data.marketData
            setMarket(market)
            // stalls = stalls.map(stall => JSON.parse(stall));
            console.log("stalls",typeof stalls);
           setStalls(stallItems);
            
           setStallChangeStatus(false);
        }).catch(err => {
                console.log(err.message);
        })


    }, [hasAStallChanged]);

    const addToCart = (stalls_id) => {
        const cart_id = localStorage.getItem('firebaseId')
        console.log(cart_id, 'vendor firebase id')
        if(localStorage.getItem("userTypes") != "vendor") {
            alert("You must be a vendor to rent a stall")
        }
        else {
        axios.post(`cart/add-stall-to-cart/${cart_id}`, {stalls_id})
        axios.request({
          method: "PUT",
          url: `stalls/${stalls_id}`,
          data: { available: false }
        })
        setStallChangeStatus(true);
        }
    }

    const useStyles = makeStyles(theme => ({
        root: {
          padding: theme.spacing(3, 0.5),
          width: "1250px"
        },
        card: {
            minWidth: 275,
            margin: "2%",
            width: "1250px",
            paddingLeft: "7%",
            paddingRight: "10%"
          },
          bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
          },
          title: {
            fontSize: 14,
          },
          headerTitle: {
              fontSize: 48,
          },
          marketTitle: {
              fontSize: 36,
          },
          stallProps: {
              fontSize: 20,
          },
          pos: {
            marginBottom: 12,
          },
          button: {
            margin: theme.spacing(1),
          },
          chip: {
            margin: theme.spacing(1),
          }
      }));
 
    const classes = useStyles();

    // const cart_id = localStorage.getItem('firebaseId')
    console.log("Getting stalls ", stalls);
    return(
        <StallsContainer>
            <Paper class="stalls-list-page-header">
            <div>
            <center><h1 className={classes.headerTitle}> List of Stalls For Rent </h1> </center>
            </div>

            <center><h2 className={classes.marketTitle}>{market.market_name} Market</h2></center>
            <center className={classes.stallProps}>
            <strong>Address: </strong> {market.address} , {market.city} , {market.state}, {market.zip_code} ,  
            <strong>Phone Number: </strong> {market.phone_number} 
            </center>
            </Paper>

            {Object.keys(stalls).map((stall, index) => (
                
                <Card className={classes.card}>
                <StallCard key ={index}>
                    {console.log(stalls[stall].id, 'stall id')}
                    <PropertiesCard>

                    <div>
                        <h3 className={classes.stallProps}>{index}. </h3>
                    </div>

                    <div>
                    <h3 className={classes.stallProps}>Size: {stalls[stall].size.length} ft by {stalls[stall].size.width} ft </h3>
                    </div>
                    <div>
                    <h3 className={classes.stallProps}> ${stalls[stall].price}</h3>
                    </div>
                    </PropertiesCard>

                    <div>
                    {stalls[stall].available ? 
                    <Button variant="contained" color="primary" className={classes.button} onClick={() => addToCart(stalls[stall].id)}>Add To Cart</Button> : 
                    <Chip
                    label="Unavailable To Rent"
                    className={classes.chip}
                    color="secondary"
                    variant="default"
                    />
                    }
                    </div>
                
                
                </StallCard>
                </Card>
            ))}
            {/* <h2> List of available stalls for {props.location.state.market_name}</h2>
            {stalls.map(stall_item => {
                console.log(stall_item, 'stall item')
                return (
                    <div>
                        {stall_item}
                    </div>
                )
                // return (<Stall stall={stall_item} setStallChangedStatus={setStallChangeStatus}/>)
            })} */}
        </StallsContainer>
    )
}

export default StallsList;
