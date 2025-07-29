import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { MuiOtpInput } from "mui-one-time-password-input";
import "./new-structure.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { HashLoader } from "react-spinners";
const animatedComponents = makeAnimated();
import CryptoJS from "crypto-js";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spinner, Card, Row, Col } from "react-bootstrap";
import {
  IconButton,
  Tooltip,
  Zoom,
  Drawer,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import {
  AddBox,
  AddCircleOutline,
  Cancel,
  CancelOutlined,
  Contactless,
  CreditCard,
  CreditCardOutlined,
  Settings,
  Visibility,
  Close,
  VisibilityOff,
  Block,
  ReplayCircleFilled,
  ExpandMore,
} from "@mui/icons-material";
import { MoonLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { setActiveTab } from "../@redux/feature/Utility";
import { getCardsDetailsAPI } from "./../@redux/action/account";
import restrict from "../components/utility/restrict";
// import CardComponent from "react-credit-cards-2";
import CardComponent from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { updateCardAPI } from "./../@redux/action/account";
import { getCardsAPI } from "../@redux/action/account";

export const CustomInput = ({
  type,
  id,
  placeholder,
  value,
  onInput,
  className,
  style,
  label,
  helperText,
  required,
  disabled = false,
  max,
  leftIcon, // Accepts an MUI icon component (e.g., <SearchIcon />)
  rightIcon, // Accepts an MUI icon component (e.g., <VisibilityIcon />)
  onRightIconClick, // Function for right icon (e.g., show/hide password)
  regex,
  onEnterPress,
}) => {
  // ✅ Validate input only on blur
  const handleBlur = () => {
    if (value && regex?.pattern && !regex.pattern.test(value)) {
      toast.error(regex.message); // ✅ Use custom error message
    }
  };

  const handleInput = (e) => {
    const { value } = e.target;

    // Allow clearing the field
    if (value === "") {
      onInput("");
      return;
    }

    // Apply character restriction from restrict.js
    if (!restrict[type] || restrict[type].test(value)) {
      onInput(value);
    }
  };

  return (
    <div
      className="input-container"
      style={{ position: "relative", width: "100%" }}
    >
      {/* Label */}
      <label className="input-label">
        {label}{" "}
        {required && <span style={{ color: "brown", fontWeight: 600 }}>*</span>}
      </label>

      {/* Input Field */}
      <div style={{ position: "relative", width: "100%" }}>
        {leftIcon && (
          <span
            style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          placeholder={placeholder}
          value={value}
          onInput={handleInput}
          className={`custom-input-class full-width ${className && className} ${
            disabled && "opacity-75"
          }`}
          style={{
            ...style,
            paddingLeft: leftIcon ? "55px" : "20px", // Adjust padding if left icon exists
            paddingRight: rightIcon ? "55px" : "20px", // Adjust padding if right icon exists
          }}
          maxLength={max || 100}
          disabled={disabled}
          required={required}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onEnterPress();
            }
          }}
        />

        {rightIcon && (
          <span
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={onRightIconClick} // Handles click event if provided
          >
            {rightIcon}
          </span>
        )}
      </div>

      {/* Helper Text */}
      {helperText && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
};

export const CustomPasswordInput = ({
  type,
  id,
  placeholder,
  value,
  onInput,
  className,
  style,
  label,
  helperText,
  required,
  disabled = false,
  max,
  leftIcon, // Accepts an MUI icon component (e.g., <SearchIcon />)
  rightIcon, // Accepts an MUI icon component (e.g., <VisibilityIcon />)
  onRightIconClick, // Function for right icon (e.g., show/hide password)
  regex,
  onEnterPress,
}) => {
  // ✅ Validate input only on blur
  const handleBlur = () => {
    if (value && regex?.pattern && !regex.pattern.test(value)) {
      toast.error(regex.message); // ✅ Use custom error message
    }
  };

  const handleInput = (e) => {
    const { value } = e.target;

    // Allow clearing the field
    if (value === "") {
      onInput("");
      return;
    }

    // Apply character restriction from restrict.js
    if (!restrict[id] || restrict[id].test(value)) {
      onInput(value);
    }
  };

  return (
    <div
      className="input-container"
      style={{ position: "relative", width: "100%" }}
    >
      {/* Label */}
      <label className="input-label">
        {label}{" "}
        {required && <span style={{ color: "brown", fontWeight: 600 }}>*</span>}
      </label>

      {/* Input Field */}
      <div style={{ position: "relative", width: "100%" }}>
        {leftIcon && (
          <span
            style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {leftIcon}
          </span>
        )}

        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onInput={handleInput}
          className={`custom-input-class full-width ${className && className} ${
            disabled && "opacity-75"
          }`}
          style={{
            ...style,
            paddingLeft: leftIcon ? "55px" : "20px", // Adjust padding if left icon exists
            paddingRight: rightIcon ? "55px" : "20px", // Adjust padding if right icon exists
          }}
          maxLength={max || 100}
          disabled={disabled}
          required={required}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onEnterPress();
            }
          }}
        />

        {rightIcon && (
          <span
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={onRightIconClick} // Handles click event if provided
          >
            {rightIcon}
          </span>
        )}
      </div>

      {/* Helper Text */}
      {helperText && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
};

// Create a custom theme
const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "9px 20px",
          fontWeight: 500,
        },
      },
    },
  },
});

export const CustomDatepicker = ({
  selectedDate,
  disabled = false,

  onDateChange,
  label,
  required,
}) => {
  // Calculate the maximum selectable date (today minus 18 years)
  const maxDate = dayjs().subtract(18, "year");

  const [startDate, setStartDate] = useState(
    selectedDate ? dayjs(selectedDate) : null
  );

  useEffect(() => {
    if (selectedDate) {
      setStartDate(dayjs(selectedDate));
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    if (date) {
      const maxDate = dayjs().subtract(18, "year");
      if (date.isAfter(maxDate)) {
        // If the date is invalid (less than 18 years), clear it and show an error

        toast.error(
          `The selected date indicates an age below 18 years. Please select a date on or before ${maxDate.format(
            "DD/MM/YYYY"
          )}.`
        );

        setStartDate(null);
        onDateChange(null);
      } else {
        setStartDate(date);
        onDateChange(date.format("YYYY-MM-DD")); // Format date using dayjs
      }
    } else {
      setStartDate(null);
      onDateChange(null);
    }
  };

  return (
    <div className="input-container" style={{ gap: "2px" }}>
      <label className="input-label">
        {label}{" "}
        {required && (
          <span style={{ color: "brown", marginLeft: "5px" }}>*</span>
        )}
      </label>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={startDate}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            maxDate={maxDate} // Disable dates below 18 years
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                padding: "4.5px 20px 4.5px 0",
                marginTop: "6px",
                fontWeight: "bold",
                fontFamily: "'Figtree', sans-serif", // Change fontFamily
                fontSize: "13px", // Change fontSize
                border: "1px solid lightgrey",
                background: "white",
              },
              "& .MuiInputBase-input": {
                fontFamily: "'Figtree', sans-serif", // Ensures the input text also uses the same font
                fontSize: "13px",
                fontWeight: "bold",
              },
              "& .MuiTypography-root": {
                fontFamily: "'Figtree', sans-serif",
                fontSize: "13px",
                fontWeight: "bold",
              },
            }}
            disabled={disabled}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
};

export const CustomPastDatepicker = ({
  selectedDate,
  disabled = false,

  onDateChange,
  label,
  required,
}) => {
  // Set the maximum selectable date to today
  const maxDate = dayjs();

  const [startDate, setStartDate] = useState(
    selectedDate ? dayjs(selectedDate) : null
  );

  useEffect(() => {
    if (selectedDate) {
      setStartDate(dayjs(selectedDate));
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    if (date) {
      if (date.isAfter(maxDate, "day")) {
        // If the date is in the future, clear it and show an error
        toast.error(
          `The selected date cannot be in the future. Please select a date on or before ${maxDate.format(
            "DD/MM/YYYY"
          )}.`
        );

        setStartDate(null);
        onDateChange(null);
      } else {
        setStartDate(date);
        onDateChange(date.format("YYYY-MM-DD")); // Format date using dayjs
      }
    } else {
      setStartDate(null);
      onDateChange(null);
    }
  };

  return (
    <div className="input-container" style={{ gap: "2px" }}>
      <label className="input-label">
        {label}{" "}
        {required && (
          <span style={{ color: "brown", marginLeft: "5px" }}>*</span>
        )}
      </label>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disabled={disabled}
            value={startDate}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            maxDate={maxDate} // Disable future dates
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                padding: "4.5px 20px 4.5px 0",
                marginTop: "6px",
                fontWeight: "bold",
                fontFamily: "'Figtree', sans-serif", // Change fontFamily
                fontSize: "13px", // Change fontSize
                border: "1px solid lightgrey",
                background: "white",
              },
              "& .MuiInputBase-input": {
                fontFamily: "'Figtree', sans-serif", // Ensures the input text also uses the same font
                fontSize: "13px",
                fontWeight: "bold",
              },
              "& .MuiTypography-root": {
                fontFamily: "'Figtree', sans-serif",
                fontSize: "13px",
                fontWeight: "bold",
              },
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
};

export const CustomFutureDatepicker = ({
  selectedDate,
  disabled = false,

  onDateChange,
  label,
  required,
}) => {
  // Set the minimum selectable date to today
  const minDate = dayjs();

  const [startDate, setStartDate] = useState(
    selectedDate ? dayjs(selectedDate) : null
  );

  useEffect(() => {
    if (selectedDate) {
      setStartDate(dayjs(selectedDate));
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    if (date) {
      if (date.isBefore(minDate, "day")) {
        // If the date is invalid (in the past), clear it and show an error
        toast.error(
          `The selected date cannot be in the past. Please select a date on or after ${minDate.format(
            "DD/MM/YYYY"
          )}.`
        );

        setStartDate(null);
        onDateChange(null);
      } else {
        setStartDate(date);
        onDateChange(date.format("YYYY-MM-DD")); // Format date using dayjs
      }
    } else {
      setStartDate(null);
      onDateChange(null);
    }
  };

  return (
    <div className="input-container" style={{ gap: "2px" }}>
      <label className="input-label">
        {label}{" "}
        {required && (
          <span style={{ color: "brown", marginLeft: "5px" }}>*</span>
        )}
      </label>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disabled={disabled}
            value={startDate}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            minDate={minDate} // Disable past dates
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                padding: "4.5px 20px 4.5px 0",
                marginTop: "6px",
                fontWeight: "bold",
                fontFamily: "'Figtree', sans-serif", // Change fontFamily
                fontSize: "13px", // Change fontSize
                border: "1px solid lightgrey",
                background: "white",
              },
              "& .MuiInputBase-input": {
                fontFamily: "'Figtree', sans-serif", // Ensures the input text also uses the same font
                fontSize: "13px",
                fontWeight: "bold",
              },
              "& .MuiTypography-root": {
                fontFamily: "'Figtree', sans-serif",
                fontSize: "13px",
                fontWeight: "bold",
              },
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
};

export const CustomModal = ({
  isOpen,
  handleClose,
  children,
  headerText,
  width,
  height,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width || 800,
    maxHeight: height || 600,
    overflowY: "auto",
    bgcolor: "white",
    border: "none !important",
    borderRadius: "16px",
    boxShadow: 15,
    p: 0,
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="custom-modal-parent">
        <div className="modal-parent p-3">
          <div className="new-modal-header d-flex align-items-center justify-content-between">
            <h4 className="text-center fs-6">{headerText}</h4>{" "}
            <CancelOutlined onClick={handleClose} className="text-secondary" />
          </div>
          {children}
        </div>
      </Box>
    </Modal>
  );
};

export const CustomOTP = ({ otp, handleChange, onEnterPress }) => {
  // Function to handle input restriction
  const handleKeyDown = (event) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Enter",
    ];

    // Allow Ctrl+V (Paste)
    if (event.ctrlKey && event.key === "v") {
      return; // Allow paste shortcut
    }

    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  const handlePaste = (event) => {
    const pasteData = event.clipboardData.getData("Text");
    if (!/^\d+$/.test(pasteData)) {
      event.preventDefault();
    }
  };
  return (
    <>
      <MuiOtpInput
        value={otp}
        onChange={handleChange}
        length={6}
        TextFieldsProps={{
          onKeyDown: handleKeyDown, // Attach keydown handler
          onPaste: handlePaste, // Attach paste handler
          onEnterPress: onEnterPress, // Attach submit handler
        }}
        sx={{
          "& .MuiOtpInput-TextField": {
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            color: "#333",
            textAlign: "center",
            border: "1px solid lightgrey",
          },
          "& .MuiOtpInput-TextField:focus": {
            borderColor: "#2196f3",
          },

          "& .MuiInputBase-input": {
            padding: "0",
            height: "47px",
            fontSize: "20px",
            fontWeight: 500,
          },
        }}
      />
    </>
  );
};

export const CustomSelect = ({
  id,
  options = [],
  value,
  onChange,
  className,
  style,
  label,
  helperText,
  required,
  disabled = false,
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "4px 12px",
      fontSize: "13px",
      borderRadius: "30px",
      border: "2px solid lightgrey",
      outline: state.isFocused ? "1px solid brown" : "none",
      backgroundColor: "white",
      fontWeight: 600,
      ...style, // Merge custom inline styles passed from the parent component
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "black" : null,
      color: state.isSelected ? "white" : null,
      fontWeight: 600,
      fontSize: "13px",
      "&:hover": {
        backgroundColor: "lightgrey",
        color: "black",
      },
    }),
  };

  // Ensure `value` is always an object from `options`
  const selectedValue =
    options.find((option) => option.value === value?.value) || null;

  return (
    <div className={`select-container ${className}`} style={style}>
      {label && (
        <label className="select-label">
          {label}
          {required && (
            <span style={{ color: "brown", marginLeft: "5px" }}>*</span>
          )}
        </label>
      )}
      <Select
        id={id}
        options={options}
        styles={customStyles}
        onChange={onChange}
        value={selectedValue}
        isSearchable={true}
        isDisabled={disabled}
      />
      {helperText && <span className="select-helper-text">{helperText}</span>}
    </div>
  );
};

export const CustomButton = ({
  type,
  label,
  icon,
  onClick,
  style,
  isLoading,
  theme,
  divClass,
  buttonClass,
  leftIcon,
  buttonStyle,
}) => {
  return (
    <div className={`input-container ${divClass}`} style={style}>
      <button
        onClick={onClick}
        className={`button-base full-width primary-button ${buttonClass}`} // Concatenate with the custom classnames
        style={buttonStyle} // Apply custom inline styles
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <HashLoader color={"white"} size={20} />
          </>
        ) : (
          <>
            {leftIcon} {label} {icon}
          </>
        )}
      </button>
    </div>
  );
};

export const CustomButtonSecondary = ({
  type,
  label,
  icon,
  onClick,
  style,
  isLoading,
  theme,
  divClass,
  buttonClass,
  leftIcon,
}) => {
  return (
    <div className={`input-container ${divClass}`} style={style}>
      <button
        onClick={onClick}
        className={`button-base full-width secondary-button ${buttonClass}`} // Concatenate with the custom classnames
        style={style} // Apply custom inline styles
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <HashLoader color={"white"} size={25} />
          </>
        ) : (
          <>
            {leftIcon} {label} {icon}
          </>
        )}
      </button>
    </div>
  );
};

export const SECRET_KEY = process.env.VITE_zpk;

// Generate the AES-128 key
export const generateKey = () => {
  const sha256Hash = CryptoJS.SHA256(SECRET_KEY); // Generate SHA-256 hash
  const keyBytes = CryptoJS.lib.WordArray.create(sha256Hash.words.slice(0, 4)); // Use the first 16 bytes (128-bit)
  return keyBytes;
};

// Decrypt function
export const decryptData = (encryptedData) => {
  const key = generateKey();
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key, {
    mode: CryptoJS.mode.ECB, // Equivalent to Java AES with no IV (ECB mode)
    padding: CryptoJS.pad.Pkcs7, // Default padding
  });
  return decryptedBytes.toString(CryptoJS.enc.Utf8); // Convert to string
};

export const getDates = (days = 30) => {
  const today = new Date();

  // Start date: 25 days before today
  const startDate = new Date();
  startDate.setDate(today.getDate() - days);

  // End date: Today's date
  const endDate = today;

  return {
    startDate: startDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
    endDate: endDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
  };
};
//laxman
export const detectcard_type = (cardNumber) => {
  const cardPatterns = [
    {
      type: "Visa",
      pattern: /^4[0-9]{12}(?:[0-9]{3})?(?:[0-9]{3})?$/,
      length: [13, 16, 19],
    },
    {
      type: "MasterCard",
      pattern: /^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-7][0-9]{13}))$/,
      length: [16],
    },
    { type: "Amex", pattern: /^3[47][0-9]{13}$/, length: [15] },
    // {
    //   type: "Discover",
    //   pattern:
    //     /^(6011[0-9]{12}|65[0-9]{14}|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9([01][0-9]|2[0-5]))[0-9]{10})$/,
    //   length: [16, 19],
    // },
    // {
    //   type: "Diners Club",
    //   pattern: /^3(0[0-5][0-9]{11}|[68][0-9]{12})$/,
    //   length: [14],
    // },
    // { type: "JCB", pattern: /^35[0-9]{14}$/, length: [16] },
  ];

  for (const card of cardPatterns) {
    if (
      card.pattern.test(cardNumber) &&
      card.length.includes(cardNumber.length)
    ) {
      return card.type;
    }
  }

  return "Other";
};

// export const CreditCardView = ({
//   item,
//   dispatch,
//   handleOpen,
//   hide = false,
// }) => {
//   const [cardType, setCardType] = useState("");
//   const [cardNumber, setCardNumber] = useState("");
//   const [holderName, setHolderName] = useState("");
//   const [expiryDate, setExpiryDate] = useState("");
//   const [cvv, setCVV] = useState("");
//   const [isLoading, setLoading] = useState(false);
//   const [show, setShow] = useState(false);

//   // Extract data directly from the item prop based on the new structure
//   const {
//     cardStatus,
//     maskedCardNumber,
//     nameOnCard,
//     cardType: apiCardType, // Renaming to avoid conflict with state variable
//     currency,
//     createdAt,
//   } = item;

//   const cardLogos = {
//     Mastercard: (
//       <img
//         src="/banks/mastercard-logo.png"
//         alt="Mastercard"
//         style={{ width: 60 }}
//       />
//     ),
//     Visa: <img src="/banks/visa-logo.png" alt="Visa" style={{ width: 60 }} />,
//     // Other: (
//     //   <img src="/banks/matchmove.png" alt="Other Card" style={{ width: 80 }} />
//     // ),
//   };

//   const cardCovers = ["/cover/card-cover-1.png"];
//   const randomImage = cardCovers[Math.floor(Math.random() * cardCovers.length)];

//   const formatCardNumberDisplay = (number) => {
//     if (!number) return "XXXX XXXX XXXX XXXX";
//     const lastFour = number.slice(-4);
//     return `**** **** **** ${lastFour}`;
//   };

//   const userDetails = useSelector((state) => state.auth.userDetails);

//   useEffect(() => {
//     if (nameOnCard) {
//       setHolderName(nameOnCard);
//     } else if (userDetails) {
//       setHolderName(
//         `${userDetails?.firstName} ${userDetails?.middleName || ""} ${
//           userDetails?.lastName
//         }`
//       );
//     }

//     // Set card type and masked number for display
//     setCardType(apiCardType === "GPR_PHY" ? "Physical" : "Virtual"); // Determine 'Physical' or 'Virtual' from cardType
//     setCardNumber(maskedCardNumber);

//     // You'll need to fetch the actual expiry date from the decrypted data when 'show' is true.
//     // For initial display, we'll leave it as default or infer if possible.
//     // For now, we'll keep the placeholder "MM/YY"
//     setExpiryDate("MM/YY");
//   }, [item, userDetails, nameOnCard, maskedCardNumber, apiCardType, currency]);

//   const showCard = async () => {
//     if (cardStatus?.toLowerCase() === "active") {
//       try {
//         setLoading(true);

//         const cardsData = await dispatch(getCardsDetailsAPI(item.cardHashId));

//         if (cardsData.status === "success") {
//           let decryptedCardDetails = decryptData(cardsData.data[0]);
//           const cardDetails = JSON.parse(decryptedCardDetails);

//           if (cardDetails) {
//             setCardNumber(formatCardNumber(cardDetails.card_number));
//             setCVV(cardDetails.cvv);
//             setExpiryDate(
//               `${cardDetails.month}/${String(cardDetails.year).slice(2)}`
//             );
//             setHolderName(
//               nameOnCard ||
//                 `${userDetails?.firstName} ${userDetails?.middleName || ""} ${
//                   userDetails?.lastName
//                 }`
//             );
//             setCardType(detectCardType(cardDetails.card_number));
//             setShow(true);
//           }
//         } else {
//           toast.error(cardsData.message);
//         }
//       } catch (error) {
//         console.error("Error showing card details:", error);
//         toast.error("Failed to retrieve card details.");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       toast.error(
//         "Card details not available for suspended or locked cards. Please activate your card to see its details."
//       );
//     }
//   };

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (show) {
//       const timer = setTimeout(() => setShow(false), 5000); // Reverts after 5s
//       return () => clearTimeout(timer); // Cleanup on re-renders
//     }
//   }, [show]);

//   return (
//     <>
//       {isLoading ? (
//         <Card
//           style={{
//             backgroundImage: `url(${randomImage})`,
//             backgroundSize: "cover",
//             borderRadius: "8px",
//             height: "200px",
//             width: "325px",
//             justifyContent: "center",
//             alignItems: "center",
//             display: "flex",
//             color: "white",
//           }}
//         >
//           <Spinner
//             animation="border"
//             role="status"
//             variant="light"
//             size="small"
//           />
//           <label style={{ marginTop: "20px", fontSize: 12 }}>
//             Fetching your card details, please wait...
//           </label>
//         </Card>
//       ) : (
//         <div className="d-flex justify-content-start align-items-start">
//           {!item ? (
//             <Card
//               style={{
//                 background: `linear-gradient(90deg, lightgrey, white)`,
//                 borderRadius: "8px",
//                 border: "2px solid rgba(0,0,0,0.45)",
//                 borderStyle: "dashed",
//                 height: "200px",
//                 width: "325px",
//                 padding: "1.5rem",
//                 color: "black",
//                 justifyContent: "space-between",
//               }}
//             >
//               <div
//                 className="d-flex align-items-center justify-content-center mx-auto my-auto gap-2 flex-column"
//                 onClick={() => {
//                   dispatch(setActiveTab("Cards"));
//                   navigate("/cards");
//                 }}
//               >
//                 <AddCircleOutline className="fs-2" />
//                 <label htmlFor="" className="fs-7">
//                   Add Your First Card
//                 </label>
//               </div>
//             </Card>
//           ) : (
//             <Card
//               style={{
//                 backgroundImage: `url(${randomImage})`,
//                 backgroundSize: "cover",
//                 borderRadius: "8px",
//                 height: "200px",
//                 width: "325px",
//                 padding: "0.5rem",
//                 color: "white",
//                 justifyContent: "space-between",
//               }}
//             >
//               <div className="d-flex align-items-center justify-content-between">
//                 {!show ? (
//                   <>
//                     <div className="d-flex">
//                       <p
//                         className="pb-0 mb-0 text-white text-lowercase"
//                         style={{
//                           transform: "rotate(-90deg)",
//                           position: "absolute",
//                           left: "-8px",
//                           top: "35px",
//                         }}
//                       >
//                         {apiCardType === "GPR_PHY" ? "PHYSICAL" : "VIRTUAL"}
//                       </p>
//                       <div
//                         className="d-flex flex-column gap-3 justify-content-between"
//                         style={{
//                           position: "absolute",
//                           top: "-2px",
//                           left: "40px",
//                         }}
//                       >
//                         <img
//                           src="/cover/contactless.png"
//                           alt="Contactless"
//                           width={50}
//                           style={{ transform: "rotate(-90deg)" }}
//                         />
//                         <img
//                           src="/cover/chip.png"
//                           alt="Chip"
//                           width={60}
//                           style={{ transform: "rotate(90deg)" }}
//                         />

//                         <div className="dots-container" style={{ gap: 5 }}>
//                           <div
//                             className="d-flex flex-column"
//                             style={{ gap: 5, marginTop: 7 }}
//                           >
//                             <div className="dot"></div>
//                             <div className="dot"></div>
//                           </div>
//                           <div
//                             className="d-flex flex-column"
//                             style={{ gap: 5 }}
//                           >
//                             <div className="dot"></div>
//                             <div className="dot"></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div
//                       className="d-flex align-items-center"
//                       style={{ position: "absolute", left: "140px" }}
//                     >
//                       <div
//                         style={{
//                           backgroundColor:
//                             cardStatus?.toLowerCase() === "active"
//                               ? "green"
//                               : cardStatus?.toLowerCase() === "suspended"
//                               ? "red"
//                               : "yellow",
//                           borderRadius: "50%",
//                           width: "8px",
//                           height: "8px",
//                           marginRight: "6px",
//                         }}
//                       ></div>
//                       <span style={{ fontWeight: "600", fontSize: 10 }}>
//                         {cardStatus?.toUpperCase()}
//                       </span>
//                     </div>
//                     <div style={{ transform: "rotate(-90deg)" }}>
//                       {cardLogos[detectCardType(maskedCardNumber)] ||
//                         cardLogos["Other"]}
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="d-flex align-items-center justify-content-between w-100">
//                       <div className="d-flex align-items-center">
//                         <img
//                           src="/auth/logo-white.png"
//                           alt="Stylopay Logo"
//                           width={30}
//                           height={30}
//                         />
//                         <p className="pb-0 mb-0 fw-600 fs-9 text-white">
//                           Stylopay
//                         </p>
//                       </div>
//                       {/* <img
//                         src="/banks/matchmove.png"
//                         alt="Matchmove Logo"
//                         width={100}
//                       /> */}
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* <div
//                 style={{
//                   fontSize: "22px",
//                   textAlign: "center",
//                 }}
//               >
//                 {!show
//                   ? formatCardNumberDisplay(maskedCardNumber)
//                   : cardNumber || "XXXX XXXX XXXX XXXX"}
//               </div> */}

//               <div
//                 className={`d-flex align-items-center justify-content-${
//                   !show ? "end me-3" : "center"
//                 } gap-5 mb-2`}
//               >
//                 {!show ? (
//                   <>
//                     <div>
//                       <label className="fs-9">Card Type</label>
//                       <div style={{ fontWeight: "600", fontSize: 12 }}>
//                         {apiCardType === "GPR_PHY" ? "PHYSICAL" : "VIRTUAL"}
//                       </div>
//                     </div>
//                     <div>
//                       <label className="fs-9">Last 4 Digits</label>
//                       <div style={{ fontWeight: "600", fontSize: 12 }}>
//                         {maskedCardNumber ? maskedCardNumber.slice(-4) : "****"}{" "}
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div>
//                       <div className="fs-9">Card Holder</div>
//                       <div style={{ fontWeight: "600", fontSize: 12 }}>
//                         {holderName || "John Doe"}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="fs-9">Valid Thru</div>
//                       <div style={{ fontWeight: "600", fontSize: 12 }}>
//                         {expiryDate || "MM/YY"}
//                       </div>
//                     </div>
//                     <div className="fs-9">
//                       <div>CVV</div>
//                       <div style={{ fontWeight: "600", fontSize: 12 }}>
//                         {cvv || "***"}
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </Card>
//           )}

//           <div className="d-flex flex-column justify-content-center align-items-center ms-2 gap-2">
//             {location.pathname === "/cards" && !hide && (
//               <div className="border rounded-pill bg-white">
//                 <Tooltip
//                   title="Card Settings"
//                   slotProps={{
//                     popper: {
//                       modifiers: [
//                         {
//                           name: "offset",
//                           options: {
//                             offset: [0, -14],
//                           },
//                         },
//                       ],
//                     },
//                   }}
//                   PopperProps={{
//                     modifiers: [
//                       {
//                         name: "preventOverflow",
//                         options: {
//                           boundary: "window",
//                         },
//                       },
//                     ],
//                   }}
//                   componentsProps={{
//                     tooltip: {
//                       sx: {
//                         fontFamily: "Poppins",
//                         fontSize: 12,
//                         backgroundColor: "black",
//                         color: "white",
//                         padding: "6px 12px",
//                       },
//                     },
//                   }}
//                   slots={{
//                     transition: Zoom,
//                   }}
//                 >
//                   <IconButton onClick={handleOpen}>
//                     <Settings className="text-dark" fontSize="small" />
//                   </IconButton>
//                 </Tooltip>
//               </div>
//             )}
//             {item.cardType !== "virtual" && // Condition updated
//               location.pathname === "/cards" &&
//               !hide && (
//                 <div className="border rounded-pill bg-white">
//                   <Tooltip
//                     title="View Card Details"
//                     slotProps={{
//                       popper: {
//                         modifiers: [
//                           {
//                             name: "offset",
//                             options: {
//                               offset: [0, -14],
//                             },
//                           },
//                         ],
//                       },
//                     }}
//                     PopperProps={{
//                       modifiers: [
//                         {
//                           name: "preventOverflow",
//                           options: {
//                             boundary: "window",
//                           },
//                         },
//                       ],
//                     }}
//                     componentsProps={{
//                       tooltip: {
//                         sx: {
//                           fontFamily: "Poppins",
//                           fontSize: 12,
//                           backgroundColor: "black",
//                           color: "white",
//                           padding: "6px 12px",
//                         },
//                       },
//                     }}
//                     slots={{
//                       transition: Zoom,
//                     }}
//                   >
//                     <IconButton variant="outline-light" onClick={showCard}>
//                       <Visibility className="text-dark" fontSize="small" />
//                     </IconButton>
//                   </Tooltip>
//                 </div>
//               )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
export const CardDetails = ({ data }) => {
  const fields = [
    { label: "Purpose", value: data.purpose },
    { label: "Nick Name", value: data.nick_name },
    // { label: "Brand", value: data.brand },
    // { label: "Form Factor", value: data.form_factor },
    // { label: "Created By", value: data.created_by },
    { label: "Program Type", value: data.program?.type },
    { label: "Program Purpose", value: data.program?.purpose },
    { label: "Name on Card", value: data.name_on_card },
    { label: "Card Type", value: data.card_type },
    { label: "Masked Card Number", value: data.card_number },
    { label: "Card Status", value: data.card_status },
    {
      label: "Created At",
      value: new Date(data.created_at).toLocaleDateString(),
    },
    { label: "Card Hash ID", value: data.card_hash_id },
    {
      label: "Transaction Currency",
      value: data.authorization_controls?.transaction_limits?.currency,
    },
    // 💡 Delivery Details
    { label: "Delivery Mode", value: data.delivery_details?.delivery_mode },
    { label: "Delivery Vendor", value: data.delivery_details?.delivery_vendor },
    { label: "Delivery Status", value: data.delivery_details?.status },
    {
      label: "Tracking Number",
      value: data.delivery_details?.tracking_number,
    },
    {
      label: "Tracking Link",
      value: data.delivery_details?.tracking_link,
    },
    {
      label: "Delivery Updated At",
      value: data.delivery_details?.updated_at
        ? new Date(data.delivery_details.updated_at).toLocaleDateString()
        : null,
    },
  ];

  const limits = data.authorization_controls?.transaction_limits?.limits || [];

  return (
    <div>
      {fields.map(
        (item, idx) =>
          item.value && (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "5px",
              }}
            >
              <label className="fs-8 text-dark text-start fw-bold">
                {item.label} :
              </label>
              <label className="fs-8 text-secondary text-end">
                {item.value}
              </label>
            </div>
          )
      )}

      {limits.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h5 className="text-dark fw-bold mb-2">Transaction Limits:</h5>
          {limits.map((limit, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                paddingBottom: "4px",
                borderBottom: "1px dashed #aaa",
              }}
            >
              <label className="fs-8 text-dark fw-bold">
                {limit.interval.replace("_", " ")} Limit
              </label>
              <label className="fs-8 text-secondary">
                {limit.amount.toLocaleString()}
                {data.authorization_controls?.transaction_limits?.currency}{" "}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CreditCardView = ({
  item,
  dispatch,
  handleOpen,
  hide = false,
}) => {
  const [card_type, setcard_type] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCVV] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  // NEW: Drawer related states
  const [openDrawer, setOpenDrawer] = useState(false);
  const [cardDetailsLoading, setCardDetailsLoading] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [activeCardDetails, setActiveCardDetails] = useState(null);
  const [hash, setHash] = useState("");
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });

  // Extract data directly from the item prop based on the new structure
  const {
    card_status,
    masked_card_number,
    name_on_card,
    card_type: apicard_type, // Renaming to avoid conflict with state variable
    currency,
    created_at,
  } = item;

  const cardLogos = {
    Mastercard: (
      <img
        src="/banks/mastercard-logo.png"
        alt="Mastercard"
        style={{ width: 60 }}
      />
    ),
    Visa: <img src="/banks/visa-logo.png" alt="Visa" style={{ width: 60 }} />,
    // Other: (
    //   <img src="/banks/matchmove.png" alt="Other Card" style={{ width: 80 }} />
    // ),
  };

  const cardCovers = ["/cover/card-cover-1.png"];
  const randomImage = cardCovers[Math.floor(Math.random() * cardCovers.length)];

  const formatCardNumberDisplay = (number) => {
    if (!number) return "XXXX XXXX XXXX XXXX";
    const lastFour = number.slice(-4);
    return `**** **** **** ${lastFour}`;
  };

  const userDetails = useSelector((state) => state.auth.userDetails);
  const userId = useSelector((state) => state.auth.user.userId);
  const cardholder_id = useSelector((state) => state.auth.user.cardholder_id);

  useEffect(() => {
    if (name_on_card) {
      setHolderName(name_on_card);
    } else if (userDetails) {
      setHolderName(
        `${userDetails?.firstName} ${userDetails?.middleName || ""} ${
          userDetails?.lastName
        }`
      );
    }

    // Set card type and masked number for display
    setcard_type(apicard_type === "GPR_PHY" ? "Physical" : "Virtual"); // Determine 'Physical' or 'Virtual' from card_type
    setCardNumber(masked_card_number);

    // You'll need to fetch the actual expiry date from the decrypted data when 'show' is true.
    // For initial display, we'll leave it as default or infer if possible.
    // For now, we'll keep the placeholder "MM/YY"
    setExpiryDate("MM/YY");
  }, [
    item,
    userDetails,
    name_on_card,
    masked_card_number,
    apicard_type,
    currency,
  ]);

  // UPDATED: showCard function now opens the drawer
  const showCard = () => {
    setActiveCard(item); // Set the current card as active
    setOpenDrawer(true); // Open the drawer
  };

  // NEW: Drawer handler functions
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    // Reset states when closing
    setState({
      number: "",
      expiry: "",
      cvc: "",
      name: "",
      focus: "",
    });
    setActiveCardDetails(null);
    setHash("");
  };

  const handleFetchCardDetails = async () => {
    if (activeCard) {
      try {
        setCardDetailsLoading(true);

        const cardsData = await dispatch(
          getCardsDetailsAPI(activeCard.card_hash_id)
        );

        if (cardsData.status === "success") {
          let decryptedCardDetails = decryptData(cardsData.data[0]);
          const cardDetails = JSON.parse(decryptedCardDetails);

          if (cardDetails) {
            setState({
              number: formatCardNumber(cardDetails.card_number),
              expiry: `${cardDetails.month}/${String(cardDetails.year).slice(
                2
              )}`,
              cvc: cardDetails.cvv,
              name:
                name_on_card ||
                `${userDetails?.firstName} ${userDetails?.middleName || ""} ${
                  userDetails?.lastName
                }`,
              focus: "",
            });
          }
        } else {
          toast.error(cardsData.message);
        }
      } catch (error) {
        console.error("Error fetching card details:", error);
        toast.error("Failed to retrieve card details.");
      } finally {
        setCardDetailsLoading(false);
      }
    }
  };

  const handleCardUpdate = async (updateData) => {
    try {
      // Add your card update API call here
      console.log("Updating card:", updateData);

      const response = await dispatch(
        updateCardAPI({
          cardId: activeCard.card_hash_id,
          updatedData: updateData,
          setCardLoading: setLoading,
        })
      );

      if (response.status === "success") {
        toast.success("Card status updated successfully");
        setActiveCard({ ...activeCard, card_status: updateData.card_status });
        // Refresh your cards list if needed
        await dispatch(getCardsAPI(userId, cardholder_id, "update"));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error updating card:", error);
      toast.error("Failed to update card Laxman.");
    }
  };

  const handleAccordionChange = (event, isExpanded) => {
    setIsAccordionOpen(isExpanded);
    if (isExpanded && !activeCardDetails) {
      // Fetch card details for accordion if not already loaded
      fetchCardDetailsForAccordion();
    }
  };

  const fetchCardDetailsForAccordion = async () => {
    try {
      // Add your API call to fetch detailed card information
      const response = await dispatch(
        getCardsDetailsAPI(activeCard.card_hash_id)
      );
      if (response.status === "success") {
        setActiveCardDetails(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching detailed card info:", error);
    }
  };

  // NEW: Drawer Component
  const DrawerComponent = () => (
    <Drawer open={openDrawer} onClose={handleCloseDrawer} anchor="right">
      <div className="p-4" style={{ width: 500 }}>
        <div className="d-flex justify-content-between w-100 align-items-center pb-3 border-bottom mb-4">
          <label htmlFor="">Card details</label>
          <Close onClick={handleCloseDrawer} color="secondary" />
        </div>

        <Card className="bg-light border p-4">
          <h5 className="mb-0 d-flex align-items-center fw-600">
            Card Ending With: {activeCard?.masked_card_number?.slice(-4)}
            <label
              htmlFor=""
              className={`${
                activeCard?.card_status === "ACTIVE"
                  ? "bg-success text-white"
                  : activeCard?.card_status === "INACTIVE"
                  ? "bg-secondary text-white"
                  : activeCard?.card_status === "PENDING"
                  ? "bg-warning text-dark"
                  : "bg-danger text-white"
              } px-2 py-1 border-0 rounded-pill text-center fw-500 ms-2`}
              style={{ fontSize: 10 }}
            >
              {activeCard?.card_status}
            </label>
          </h5>

          <Divider className="w-100 my-3" />

          <div className="d-flex justify-content-between align-items-start">
            {cardDetailsLoading ? (
              <div
                style={{
                  width: 345,
                  height: 200,
                  background: "linear-gradient(45deg, lightgrey, white)",
                  borderRadius: 14.5,
                  border: "2px solid lightgrey",
                }}
                className="d-flex flex-column justify-content-center align-items-center gap-3"
              >
                <MoonLoader size={45} />
                <label htmlFor="" className="fs-8 text-secondary fw-600">
                  Loading your card details...
                </label>
              </div>
            ) : (
              <CardComponent
                number={state.number}
                expiry={state.expiry}
                cvc={state.cvc}
                name={state.name}
                focused={state.focus}
              />
            )}

            <div className="d-flex flex-column justify-content-start align-items-start gap-3">
              {state.number ? (
                <Tooltip
                  title="Hide Card Details"
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                  }}
                  PopperProps={{
                    modifiers: [
                      {
                        name: "preventOverflow",
                        options: {
                          boundary: "window",
                        },
                      },
                    ],
                  }}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontFamily: "inherit",
                        fontSize: 12,
                        backgroundColor: "black",
                        color: "white",
                        padding: "6px 12px",
                      },
                    },
                  }}
                  slots={{
                    transition: Zoom,
                  }}
                >
                  <IconButton
                    variant="outline-light"
                    onClick={() =>
                      setState({
                        number: "",
                        expiry: "",
                        cvc: "",
                        name: "",
                        focus: "",
                      })
                    }
                    className="rounded-circle p-2 bg-white border-secondary border cursor-pointer"
                  >
                    <VisibilityOff className="text-dark" fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip
                  title="View Card Details"
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                  }}
                  PopperProps={{
                    modifiers: [
                      {
                        name: "preventOverflow",
                        options: {
                          boundary: "window",
                        },
                      },
                    ],
                  }}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontFamily: "inherit",
                        fontSize: 12,
                        backgroundColor: "black",
                        color: "white",
                        padding: "6px 12px",
                      },
                    },
                  }}
                  slots={{
                    transition: Zoom,
                  }}
                >
                  <IconButton
                    variant="outline-light"
                    onClick={handleFetchCardDetails}
                    className="rounded-circle p-2 bg-white border-secondary border cursor-pointer"
                  >
                    <Visibility className="text-dark" fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {activeCard?.card_status === "ACTIVE" ? (
                <Tooltip
                  title="Block Card"
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                  }}
                  PopperProps={{
                    modifiers: [
                      {
                        name: "preventOverflow",
                        options: {
                          boundary: "window",
                        },
                      },
                    ],
                  }}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontFamily: "inherit",
                        fontSize: 12,
                        backgroundColor: "black",
                        color: "white",
                        padding: "6px 12px",
                      },
                    },
                  }}
                  slots={{
                    transition: Zoom,
                  }}
                >
                  <IconButton
                    variant="outline-light"
                    onClick={() =>
                      handleCardUpdate({
                        card_status: "INACTIVE",
                        updated_by: "test",
                      })
                    }
                    className="rounded-circle bg-white border-danger border cursor-pointer"
                  >
                    <Block className="text-danger" fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : activeCard?.card_status === "INACTIVE" ? (
                <Tooltip
                  title="Unblock Card"
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                  }}
                  PopperProps={{
                    modifiers: [
                      {
                        name: "preventOverflow",
                        options: {
                          boundary: "window",
                        },
                      },
                    ],
                  }}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontFamily: "inherit",
                        fontSize: 12,
                        backgroundColor: "black",
                        color: "white",
                        padding: "6px 12px",
                      },
                    },
                  }}
                  slots={{
                    transition: Zoom,
                  }}
                >
                  <IconButton
                    variant="outline-light"
                    onClick={() =>
                      handleCardUpdate({
                        card_status: "ACTIVE",
                        updated_by: "test",
                      })
                    }
                    className="rounded-circle bg-white border-success border cursor-pointer"
                  >
                    <ReplayCircleFilled
                      className="text-success"
                      fontSize="small"
                    />
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              )}
            </div>
          </div>

          {hash && (
            <iframe
              src={`https://demo.airwallex.com/issuing/pci/v2/${activeCard?.card_id}/pin#${hash}`}
              style={{ height: "225px", width: "100%" }}
            />
          )}

          <Accordion
            className="mt-4 bg-light border rounded-4 border-light border-2 box-shadow text-dark"
            expanded={isAccordionOpen}
            onChange={handleAccordionChange}
          >
            <AccordionSummary
              expandIcon={<ExpandMore className="text-dark" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography
                component="span"
                sx={{
                  fontFamily: "inherit",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                View Card Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {activeCardDetails ? (
                <CardDetails data={activeCardDetails} />
              ) : (
                <div className="d-flex flex-column justify-content-center align-items-center gap-3 my-5">
                  <MoonLoader size={45} />
                  <label htmlFor="" className="fs-8 text-secondary fw-600">
                    Loading your card details...
                  </label>
                </div>
              )}
            </AccordionDetails>
          </Accordion>
        </Card>
      </div>
    </Drawer>
  );

  // const DrawerComponent = () => (
  //   <Drawer open={openDrawer} onClose={handleCloseDrawer} anchor="right">
  //     <div className="p-4" style={{ width: 500 }}>
  //       {/* Header */}
  //       <div className="d-flex justify-content-between w-100 align-items-center pb-3 border-bottom mb-4">
  //         <h6 className="mb-0 fw-600">Card details</h6>
  //         <IconButton onClick={handleCloseDrawer} className="p-1">
  //           <Close color="secondary" fontSize="small" />
  //         </IconButton>
  //       </div>

  //       {/* Card Visual Section */}
  //       <div className="mb-4">
  //         <div
  //           className="position-relative bg-light rounded-3 p-4"
  //           style={{ height: 280 }}
  //         >
  //           {cardDetailsLoading ? (
  //             <div className="d-flex flex-column justify-content-center align-items-center h-100 gap-3">
  //               <MoonLoader size={45} />
  //               <span className="fs-7 text-secondary fw-500">
  //                 Loading your card details...
  //               </span>
  //             </div>
  //           ) : (
  //             <>
  //               {/* Virtual Card Display */}
  //               <div
  //                 className="mx-auto rounded-3 position-relative overflow-hidden"
  //                 style={{
  //                   width: 320,
  //                   height: 200,
  //                   background:
  //                     "linear-gradient(135deg, #e8e9ea 0%, #f5f5f5 100%)",
  //                   boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  //                 }}
  //               >
  //                 {/* Card Content */}
  //                 <div className="p-3 h-100 d-flex flex-column justify-content-between text-dark">
  //                   <div className="d-flex justify-content-between align-items-start">
  //                     <div>
  //                       <div
  //                         className="fw-500 text-uppercase"
  //                         style={{ fontSize: 11, letterSpacing: 1 }}
  //                       >
  //                         VIRTUAL
  //                       </div>
  //                     </div>
  //                     <div className="d-flex align-items-center gap-2">
  //                       <img
  //                         src="/airwallex-logo.svg"
  //                         alt="Airwallex"
  //                         style={{ height: 20 }}
  //                       />
  //                     </div>
  //                   </div>

  //                   <div className="mt-4">
  //                     <div className="fw-600 mb-2" style={{ fontSize: 14 }}>
  //                       {state.name ||
  //                         activeCard?.cardholder_name ||
  //                         "Demozoqq"}
  //                     </div>
  //                     <div className="d-flex align-items-center gap-2">
  //                       <span
  //                         className="fw-500"
  //                         style={{ fontSize: 16, letterSpacing: 2 }}
  //                       >
  //                         ••••{" "}
  //                         {activeCard?.masked_card_number?.slice(-4) || "5182"}
  //                       </span>
  //                     </div>
  //                   </div>

  //                   <div className="d-flex justify-content-end">
  //                     <div className="fw-bold" style={{ fontSize: 24 }}>
  //                       VISA
  //                     </div>
  //                     <div className="ms-2 text-muted" style={{ fontSize: 10 }}>
  //                       Business
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>

  //               {/* View Card Details Button */}
  //               <div className="text-center mt-3">
  //                 {state.number ? (
  //                   <button
  //                     onClick={() =>
  //                       setState({
  //                         number: "",
  //                         expiry: "",
  //                         cvc: "",
  //                         name: "",
  //                         focus: "",
  //                       })
  //                     }
  //                     className="btn btn-link text-decoration-none d-flex align-items-center justify-content-center mx-auto"
  //                     style={{ fontSize: 14, color: "#6366f1" }}
  //                   >
  //                     <VisibilityOff className="me-2" fontSize="small" />
  //                     Hide card details
  //                   </button>
  //                 ) : (
  //                   <button
  //                     onClick={handleFetchCardDetails}
  //                     className="btn btn-link text-decoration-none d-flex align-items-center justify-content-center mx-auto"
  //                     style={{ fontSize: 14, color: "#6366f1" }}
  //                   >
  //                     <Visibility className="me-2" fontSize="small" />
  //                     View card details
  //                   </button>
  //                 )}
  //               </div>
  //             </>
  //           )}
  //         </div>
  //       </div>

  //       {/* Card Information */}
  //       <div className="bg-white rounded-3 border border-light">
  //         {/* Card Basic Info */}
  //         <div className="p-4 border-bottom border-light">
  //           <div className="row g-3">
  //             <div className="col-12">
  //               <div className="d-flex justify-content-between align-items-center">
  //                 <div>
  //                   <label className="text-muted mb-1" style={{ fontSize: 12 }}>
  //                     Card nickname
  //                   </label>
  //                   <div className="fw-500" style={{ fontSize: 14 }}>
  //                     {activeCard?.card_nickname || "Preeti"}
  //                   </div>
  //                 </div>
  //                 <div className="text-end">
  //                   <label className="text-muted mb-1" style={{ fontSize: 12 }}>
  //                     Card type
  //                   </label>
  //                   <div className="fw-500" style={{ fontSize: 14 }}>
  //                     {activeCard?.card_type || "Company card"}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>

  //             <div className="col-12">
  //               <div className="d-flex justify-content-between align-items-center">
  //                 <div>
  //                   <label className="text-muted mb-1" style={{ fontSize: 12 }}>
  //                     Card status
  //                   </label>
  //                   <div>
  //                     <span
  //                       className={`${
  //                         activeCard?.card_status === "ACTIVE"
  //                           ? "bg-success text-white"
  //                           : activeCard?.card_status === "INACTIVE"
  //                           ? "bg-secondary text-white"
  //                           : activeCard?.card_status === "PENDING"
  //                           ? "bg-warning text-dark"
  //                           : "bg-danger text-white"
  //                       } px-2 py-1 rounded-pill fw-500`}
  //                       style={{ fontSize: 11 }}
  //                     >
  //                       {activeCard?.card_status || "Active"}
  //                     </span>
  //                   </div>
  //                 </div>
  //                 <div className="text-end">
  //                   <label className="text-muted mb-1" style={{ fontSize: 12 }}>
  //                     Card purpose
  //                   </label>
  //                   <div className="fw-500" style={{ fontSize: 14 }}>
  //                     {activeCard?.card_purpose || "Office supplies"}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Card Contacts */}
  //         <div className="p-4 border-bottom border-light">
  //           <label className="text-muted mb-2" style={{ fontSize: 12 }}>
  //             Card contacts
  //           </label>
  //           <div
  //             className="fw-500 text-primary text-decoration-underline"
  //             style={{ fontSize: 14, cursor: "pointer" }}
  //           >
  //             {activeCard?.card_contacts || "John Livonee"}
  //           </div>
  //         </div>

  //         {/* Billing Address */}
  //         <div className="p-4">
  //           <label className="text-muted mb-2" style={{ fontSize: 12 }}>
  //             Billing address
  //           </label>
  //           <div className="fw-500" style={{ fontSize: 14 }}>
  //             {activeCard?.billing_address ||
  //               "Melbourne St, Melbourne St, Melbourne, VIC, 3000, Singapore"}
  //           </div>
  //         </div>
  //       </div>

  //       {/* Action Buttons */}
  //       <div className="mt-4 d-flex gap-2">
  //         {activeCard?.card_status === "ACTIVE" ? (
  //           <button
  //             onClick={() => handleCardUpdate({ card_status: "INACTIVE" })}
  //             className="btn btn-outline-danger btn-sm d-flex align-items-center"
  //           >
  //             <Block className="me-2" fontSize="small" />
  //             Block Card
  //           </button>
  //         ) : activeCard?.card_status === "INACTIVE" ? (
  //           <button
  //             onClick={() => handleCardUpdate({ card_status: "ACTIVE" })}
  //             className="btn btn-outline-success btn-sm d-flex align-items-center"
  //           >
  //             <ReplayCircleFilled className="me-2" fontSize="small" />
  //             Unblock Card
  //           </button>
  //         ) : null}

  //         <button className="btn btn-primary btn-sm ms-auto d-flex align-items-center">
  //           <Edit className="me-2" fontSize="small" />
  //           Manage card
  //         </button>
  //       </div>

  //       {/* PIN Section (if hash exists) */}
  //       {hash && (
  //         <div className="mt-4">
  //           <div className="border rounded-3 overflow-hidden">
  //             <iframe
  //               src={`https://demo.airwallex.com/issuing/pci/v2/${activeCard?.card_id}/pin#${hash}`}
  //               style={{ height: "225px", width: "100%", border: "none" }}
  //             />
  //           </div>
  //         </div>
  //       )}

  //       {/* Additional Card Details Accordion */}
  //       {activeCardDetails && (
  //         <Accordion
  //           className="mt-4 border rounded-3"
  //           expanded={isAccordionOpen}
  //           onChange={handleAccordionChange}
  //         >
  //           <AccordionSummary
  //             expandIcon={<ExpandMore />}
  //             aria-controls="panel1-content"
  //             id="panel1-header"
  //           >
  //             <Typography
  //               component="span"
  //               sx={{
  //                 fontFamily: "inherit",
  //                 fontSize: 14,
  //                 fontWeight: 500,
  //               }}
  //             >
  //               Additional Details
  //             </Typography>
  //           </AccordionSummary>
  //           <AccordionDetails>
  //             <CardDetails data={activeCardDetails} />
  //           </AccordionDetails>
  //         </Accordion>
  //       )}
  //     </div>
  //   </Drawer>
  // );

  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 5000); // Reverts after 5s
      return () => clearTimeout(timer); // Cleanup on re-renders
    }
  }, [show]);

  return (
    <>
      {isLoading ? (
        <Card
          style={{
            backgroundImage: `url(${randomImage})`,
            backgroundSize: "cover",
            borderRadius: "8px",
            height: "200px",
            width: "325px",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            color: "white",
          }}
        >
          <Spinner
            animation="border"
            role="status"
            variant="light"
            size="small"
          />
          <label style={{ marginTop: "20px", fontSize: 12 }}>
            Fetching your card details, please wait...
          </label>
        </Card>
      ) : (
        <div className="d-flex justify-content-start align-items-start">
          {!item ? (
            <Card
              style={{
                background: `linear-gradient(90deg, lightgrey, white)`,
                borderRadius: "8px",
                border: "2px solid rgba(0,0,0,0.45)",
                borderStyle: "dashed",
                height: "200px",
                width: "325px",
                padding: "1.5rem",
                color: "black",
                justifyContent: "space-between",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center mx-auto my-auto gap-2 flex-column"
                onClick={() => {
                  dispatch(setActiveTab("Cards"));
                  navigate("/cards");
                }}
              >
                <AddCircleOutline className="fs-2" />
                <label htmlFor="" className="fs-7">
                  Add Your First Card
                </label>
              </div>
            </Card>
          ) : (
            <Card
              style={{
                backgroundImage: `url(${randomImage})`,
                backgroundSize: "cover",
                borderRadius: "8px",
                height: "200px",
                width: "325px",
                padding: "0.5rem",
                color: "white",
                justifyContent: "space-between",
              }}
            >
              <div className="d-flex align-items-center justify-content-between">
                {!show ? (
                  <>
                    <div className="d-flex">
                      <p
                        className="pb-0 mb-0 text-white text-lowercase"
                        style={{
                          transform: "rotate(-90deg)",
                          position: "absolute",
                          left: "-8px",
                          top: "35px",
                        }}
                      >
                        {apicard_type === "GPR_PHY" ? "PHYSICAL" : "VIRTUAL"}
                      </p>
                      <div
                        className="d-flex flex-column gap-3 justify-content-between"
                        style={{
                          position: "absolute",
                          top: "-2px",
                          left: "40px",
                        }}
                      >
                        <img
                          src="/cover/contactless.png"
                          alt="Contactless"
                          width={50}
                          style={{ transform: "rotate(-90deg)" }}
                        />
                        <img
                          src="/cover/chip.png"
                          alt="Chip"
                          width={60}
                          style={{ transform: "rotate(90deg)" }}
                        />

                        <div className="dots-container" style={{ gap: 5 }}>
                          <div
                            className="d-flex flex-column"
                            style={{ gap: 5, marginTop: 7 }}
                          >
                            <div className="dot"></div>
                            <div className="dot"></div>
                          </div>
                          <div
                            className="d-flex flex-column"
                            style={{ gap: 5 }}
                          >
                            <div className="dot"></div>
                            <div className="dot"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="d-flex align-items-center"
                      style={{ position: "absolute", left: "140px" }}
                    >
                      <div
                        style={{
                          backgroundColor:
                            card_status?.toLowerCase() === "active"
                              ? "green"
                              : card_status?.toLowerCase() === "suspended"
                              ? "red"
                              : "yellow",
                          borderRadius: "50%",
                          width: "8px",
                          height: "8px",
                          marginRight: "6px",
                        }}
                      ></div>
                      <span style={{ fontWeight: "600", fontSize: 10 }}>
                        {card_status?.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ transform: "rotate(-90deg)" }}>
                      {cardLogos[detectcard_type(masked_card_number)] ||
                        cardLogos["Other"]}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <div className="d-flex align-items-center">
                        <img
                          src="/auth/logo-white.png"
                          alt="Stylopay Logo"
                          width={30}
                          height={30}
                        />
                        <p className="pb-0 mb-0 fw-600 fs-9 text-white">
                          Stylopay
                        </p>
                      </div>
                      {/* <img
                        src="/banks/matchmove.png"
                        alt="Matchmove Logo"
                        width={100}
                      /> */}
                    </div>
                  </>
                )}
              </div>

              {/* <div
                style={{
                  fontSize: "22px",
                  textAlign: "center",
                }}
              >
                {!show
                  ? formatCardNumberDisplay(masked_card_number)
                  : cardNumber || "XXXX XXXX XXXX XXXX"}
              </div> */}

              <div
                className={`d-flex align-items-center justify-content-${
                  !show ? "end me-3" : "center"
                } gap-5 mb-2`}
              >
                {!show ? (
                  <>
                    <div>
                      <label className="fs-9">Card Type</label>
                      <div style={{ fontWeight: "600", fontSize: 12 }}>
                        {apicard_type === "GPR_PHY" ? "PHYSICAL" : "VIRTUAL"}
                      </div>
                    </div>
                    <div>
                      <label className="fs-9">Last 4 Digits</label>
                      <div style={{ fontWeight: "600", fontSize: 12 }}>
                        {masked_card_number
                          ? masked_card_number.slice(-4)
                          : "****"}{" "}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="fs-9">Card Holder</div>
                      <div style={{ fontWeight: "600", fontSize: 12 }}>
                        {holderName || "John Doe"}
                      </div>
                    </div>
                    <div>
                      <div className="fs-9">Valid Thru</div>
                      <div style={{ fontWeight: "600", fontSize: 12 }}>
                        {expiryDate || "MM/YY"}
                      </div>
                    </div>
                    <div className="fs-9">
                      <div>CVV</div>
                      <div style={{ fontWeight: "600", fontSize: 12 }}>
                        {cvv || "***"}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}

          <div className="d-flex flex-column justify-content-center align-items-center ms-2 gap-2">
            {location.pathname === "/cards" && !hide && (
              <div className="border rounded-pill bg-white">
                <Tooltip
                  title="Card Settings"
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                  }}
                  PopperProps={{
                    modifiers: [
                      {
                        name: "preventOverflow",
                        options: {
                          boundary: "window",
                        },
                      },
                    ],
                  }}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontFamily: "Poppins",
                        fontSize: 12,
                        backgroundColor: "black",
                        color: "white",
                        padding: "6px 12px",
                      },
                    },
                  }}
                  slots={{
                    transition: Zoom,
                  }}
                >
                  <IconButton onClick={handleOpen}>
                    <Settings className="text-dark" fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            )}
            {item.card_type !== "virtual" && // Condition updated
              location.pathname === "/cards" &&
              !hide && (
                <div className="border rounded-pill bg-white">
                  <Tooltip
                    title="View Card Details"
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, -14],
                            },
                          },
                        ],
                      },
                    }}
                    PopperProps={{
                      modifiers: [
                        {
                          name: "preventOverflow",
                          options: {
                            boundary: "window",
                          },
                        },
                      ],
                    }}
                    componentsProps={{
                      tooltip: {
                        sx: {
                          fontFamily: "Poppins",
                          fontSize: 12,
                          backgroundColor: "black",
                          color: "white",
                          padding: "6px 12px",
                        },
                      },
                    }}
                    slots={{
                      transition: Zoom,
                    }}
                  >
                    <IconButton variant="outline-light" onClick={showCard}>
                      <Visibility className="text-dark" fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
          </div>
        </div>
      )}

      {/* NEW: Add the Drawer Component */}
      <DrawerComponent />
    </>
  );
};
