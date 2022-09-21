import { Avatar, Box, Chip, InputBase, Typography, AvatarGroup, CircularProgress, IconButton, ButtonBase } from '@mui/material'
import React, { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { IoMdPhotos, IoMdSend } from 'react-icons/io'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { getDatabase, ref, push, set, onChildAdded, remove, update, onChildRemoved, onChildMoved, onChildChanged } from "firebase/database";
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import moment from "moment"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getAuth, signOut } from 'firebase/auth'
import { v4 as uuidv4 } from 'uuid'
import { MdDelete } from 'react-icons/md'
import { AiFillEdit } from 'react-icons/ai'
import { isElectron } from '@firebase/util'
import { AiOutlineClose } from 'react-icons/ai'
import FileBase64 from 'react-filebase64';
import { AiFillFileAdd } from "react-icons/ai"
import { Buffer } from "buffer";
const MainPage = () => {
    const [open2, setOpen2] = useState(null)
    const [user, setUser] = useState()
    const auth = getAuth()
    const [openHandler, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const logout = () => {
        signOut(auth)
    }
    const handleClickClose = () => {
        setOpen(false);
    };
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const db = getDatabase();
    const [text, settext] = useState("")
    const [data, setData] = useState([])
    const [loading, setLoading] = useState([])
    const [Id, setId] = useState()
    const [isTyping, setisTyping] = useState()
    const [url, setUrl] = useState()
    const loadPartcipants = () => {
        const Participants = new Set(data.map((e) => {
            return ([e.name, e.photourl])
        }))
    }
    const handelDelete = () => {
        remove(ref(db, `/${Id}`));
        setId("")
        setOpen2(null)
    }
    const handelUpdate = () => {
        const input = prompt();
        const prevData = data.filter((e) => e.uuid === Id)

        if (input) {
            update(ref(db, `/${Id}`), {
                name: prevData[0].name,
                text: input,
                photourl: prevData[0].photourl,
                time: prevData[0].time,
                uuid: prevData[0].uuid,
            }
            );
        }
        setId("");
        setOpen2(null)
    }
    onChildRemoved(ref(db), response => {

        const filteredData = data.filter((e) => e.uuid !== response.val().uuid);
        setData(filteredData);

    })
    onChildChanged(ref(db), res => {
        const id = res.val().uuid;
        setData(data => data.map(e => {
            if (e.uuid === id) return { ...e, text: res.val().text }
            return e
        }))

    })
    const handelSubmit = (e, item) => {
        if (auth.currentUser.displayName === item.name) {
            setOpen2(e.currentTarget)
            setId(item.uuid)
        }
    }
    useEffect(() => {
        setLoading(true);
         Notification.requestPermission().then(perm => {
            console.log(perm)
        })
        onChildAdded(ref(db), (response) => {
            setData(data => [...data, response.val()]);
            setTimeout(() => {
                updateHeight();
            }, 700);
            setLoading(false)
        });
        loadPartcipants();
    }, [])
    const sendText = () => {
        const uuid = uuidv4();
        set(ref(db, `/${uuid}`), {
            name: auth.currentUser.displayName,
            text,
            photourl: auth.currentUser.photoURL,
            time: moment(new Date()).format('h:mm'),
            uuid,
            imgUrl: url ? url : null
        })
        settext("")
        if(user!==auth.currentUser.displayName)
        new Notification("Example Notification", {
            body:Math.random(),
        })
        setUrl("")
        setisTyping(false);
    }
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        }
    })
    useEffect(() => {
        updateHeight();
    }, [isTyping])

    const updateHeight = () => {
        const element = document.getElementById("scroll")
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }
    const onfocus = (e , name) => {
        e.key === "Enter" && sendText()
        setUser(name);
        setisTyping(true);
    }
    const onTyping = (e) => {
        settext(e.target.value);
    }
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    }
    const FileHandler = async (e) => {
        const base64 = await convertToBase64(e.target.files[0]);
        setUrl(base64);
    }
    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ height: '100%', width: '100%', background: 'linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)', }} >
                    <Box sx={{ height: '8%', width: '100%', backgroundColor: '#4c577a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AvatarGroup max={4} sx={{ margin: '0px 5px' }}>
                                {
                                    (Array.from(new Set(data?.map((e) => {
                                        return e.photourl
                                    }))).map((e, i) => {
                                        return <Avatar key={i} sx={{ width: 30, height: 30 }} src={e} />
                                    })
                                    )
                                }
                            </AvatarGroup>
                        </Box>
                        <Box>
                            <Typography variant='subtitle1' sx={{ color: 'white' }}>{Array.from(new Set(data?.map((e) => {
                                return e.photourl
                            }))).length} Participants</Typography>
                        </Box>
                        <Box>
                            <IconButton style={{ margin: "0px 6px" }}>
                                <BsThreeDotsVertical aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick} color='white' size={25} />
                            </IconButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={() => handleClickOpen()}> Participants</MenuItem>
                                <Dialog
                                    open={openHandler}
                                    onClose={handleClickClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                        {`${Array.from(new Set(data?.map((e) => {
                                            return e.photourl
                                        }))).length} Members`}
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            {
                                                (Array.from(new Set(data?.map((e) => {
                                                    return e.name
                                                }))).map((e, i) => {
                                                    return <p style={{ margin: '2px' }} > {i + 1}. &nbsp;{e}</p>
                                                })
                                                )
                                            }
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClickClose}>Close</Button>
                                    </DialogActions>
                                </Dialog>
                                <MenuItem onClick={() => logout()} >Logout</MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                    <Box id='scroll' sx={{ height: "calc(100vh - 8% - 10%)", overflow: 'scroll' }} >
                        {loading ? <Box sx={{ display: 'flex', height: '100%', justifyContent: "center", alignItems: 'center' }}>
                            <CircularProgress />
                        </Box> :
                            data.map((item, id) => {
                                return (
                                    <Box  key={id}  sx={{ display: "flex", justifyContent: `${item.name === auth.currentUser.displayName ? "flex-start " : "flex-end "} ` }}>
                                        <ButtonBase onClick={(e) => handelSubmit(e, item)} sx={{ display: "flex", justifyContent: `${item.name === auth.currentUser.displayName ? "flex-start " : "flex-end "} ` }}>
                                            <Box sx={{ display: "inline-block", textAlign: 'left', borderRadius: '6px', backgroundColor: '#4c577a', margin: "2px", right: '0px', padding: '8px', color: "white" }}>
                                                <Box style={{ maxWidth: '50vw', display: 'flex', flexDirection: 'column', overflowWrap: 'break-word' }}>
                                                    <Chip avatar={<Avatar src={item.photourl} />} label={(item.name).split(' ')[0]} sx={{ color: 'white' }} />
                                                    {
                                                        item.imgUrl && <img src={item.imgUrl} alt="" style={{ margin: '3px', maxWidth: '100%' }} />
                                                    }
                                                    <Box>
                                                        <Typography variant='subtitle1'>{item.text}</Typography>
                                                    </Box>
                                                    <Box style={{ display: 'flex', alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Box>
                                                            <small >{item.time}</small>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </ButtonBase>
                                    </Box>

                                )
                            })

                        }
                        {
                            isTyping ? 
                                <Typography  variant='caption' color="white" > {user} is Typing ...</Typography> : "" 
                        }
                        <Menu open={Boolean(open2)} anchorEl={open2} >
                            <MenuItem onClick={() => handelDelete()}> <MdDelete /> &nbsp; Delete </MenuItem>
                            <MenuItem onClick={() => handelUpdate()}> <AiFillEdit />&nbsp; Edit </MenuItem>
                            <MenuItem onClick={() => setOpen2(null)}> <AiOutlineClose />&nbsp; Close</MenuItem>
                        </Menu>
                    </Box>
                    <Box sx={{ display: "flex", height: "10%", backgroundColor: '#4c577a', justifyContent: "space-between", alignItems: 'center', borderTopLeftRadius: "30px", borderTopRightRadius: "30px", position: "fixed", bottom: "0px", width: "99%", padding: '0px  12px' }}>
                        <InputBase fullWidth style={{ color: "white" }} value={text} onKeyUp={() => setTimeout(() => {
                            setisTyping(false)
                        }, 5500)}   onKeyDown={(e) => {
                            onfocus(e , auth.currentUser.displayName) 
                        }} onBlur={() => setisTyping(false)}  onChange={(e) => onTyping(e, auth.currentUser.displayName)} />
                        {/* <Picker /> */}
                        <div className="file_input-container">
                            <IconButton>
                                <label htmlFor="file"> <IoMdPhotos color='white' size={24} /> </label>
                                <input type="file" className='file' accept="image/png, image/gif, image/jpeg" onChange={(e) => FileHandler(e)} name="" id="file" />
                            </IconButton>
                        </div>
                        <IconButton sx={{ marginRight: "8px" }} onClick={() => sendText()}>
                            <IoMdSend color='white' size={28} />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default React.memo(MainPage) 
