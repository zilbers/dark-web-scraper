import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import ReplayIcon from '@material-ui/icons/Replay';
import WorkIcon from '@material-ui/icons/Work';
import WorkOffIcon from '@material-ui/icons/WorkOff';
import { UserContext } from '../context/UserContext';
import Modal from './Modal';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));
const regex = /On [0-9]?[0-9] minutes cooldown!/g;

export default function PrimarySearchAppBar({
  length,
  deleted,
  setHiding,
  setInputText,
  inputText,
  getData,
}) {
  const context = React.useContext(UserContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [scraperStatus, setScraperStatus] = React.useState({
    message: 'Waiting for update!',
    active: false,
  });
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const checkStatus = async () => {
    const { data: results } = await axios.get('/api/data/_status');
    if (!results.checked && results.active === false) {
      await axios.get('/api/data/_check');
      getData();
    }
    setScraperStatus(
      results.message
        ? results
        : { message: 'Something is wrong', active: false }
    );
  };

  const showAll = async () => {
    axios.put(`/api/user/_alerts?id=${context.userId}`, []);
    setHiding([]);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        Scraper Status:{' '}
        <span
          style={{
            background: scraperStatus.active
              ? 'green'
              : scraperStatus.message.match(regex)
              ? 'orange'
              : 'red',
            padding: '5px',
            fontWeight: 600,
          }}
        >
          {scraperStatus.message}
        </span>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label='new entries' color='inherit' onClick={showAll}>
          <Badge badgeContent={deleted} color='secondary'>
            <ReplayIcon />
          </Badge>
        </IconButton>
        <p>Reset Bins</p>
      </MenuItem>

      <MenuItem>
        <IconButton aria-label='new entries' color='inherit'>
          <Badge badgeContent={length} color='secondary'>
            <NewReleasesIcon />
          </Badge>
        </IconButton>
        <p>New bins</p>
      </MenuItem>

      <MenuItem>
        <Modal />
        <p>Scraper settings</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          edge='end'
          aria-label='Scraper status'
          aria-controls={menuId}
          aria-haspopup='true'
          onClick={handleProfileMenuOpen}
          color='inherit'
        >
          {scraperStatus.active ? (
            <>
              <div
                style={{
                  background: 'green',
                  display: 'flex',
                  padding: '5px',
                }}
              >
                <WorkIcon />
                {'  '}
                on
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  background: scraperStatus.message.match(regex)
                    ? 'orange'
                    : 'red',
                  display: 'flex',
                  padding: '5px',
                }}
              >
                <WorkOffIcon /> {'  '}
                off
              </div>
            </>
          )}
        </IconButton>
      </MenuItem>
    </Menu>
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      checkStatus();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.grow}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='open drawer'
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant='h6' noWrap>
            Dark-Web-Scraper
          </Typography>
          {/* <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={({ target }) => {
                setInputText(target.value);
              }}
              value={inputText}
            />
          </div> */}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label='new entries'
              color='inherit'
              onClick={showAll}
            >
              <Badge badgeContent={deleted} color='secondary'>
                <ReplayIcon />
              </Badge>
            </IconButton>

            <IconButton aria-label='new entries' color='inherit'>
              <Badge badgeContent={length} color='secondary'>
                <NewReleasesIcon />
              </Badge>
            </IconButton>

            <Modal />

            <IconButton
              edge='end'
              aria-label='Scraper status'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
            >
              {scraperStatus.active ? (
                <>
                  <div
                    style={{
                      background: 'green',
                      display: 'flex',
                      padding: '5px',
                    }}
                  >
                    <WorkIcon />
                    {'  '}
                    on
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      background: scraperStatus.message.match(regex)
                        ? 'orange'
                        : 'red',
                      display: 'flex',
                      padding: '5px',
                    }}
                  >
                    <WorkOffIcon /> {'  '}
                    off
                  </div>
                </>
              )}
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
