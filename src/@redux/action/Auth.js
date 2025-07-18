import axios from "axios";
import {
  setUser,
  setAuthenticated,
  setUserDetails,
  setOnboarded,
  setKycDetails,
  resetAuthStates,
  setType,
  setLoginEmail,
} from "../feature/Auth";
import { toast } from "react-toastify";

import { resetAccountStates } from "../feature/account";
import { resetUtilityStates } from "../feature/Utility";
import axiosInstance from "./../axiosInstance";

// Helper to handle API errors
const handleApiError = (error) => {
  console.error("API Error:", error);
  const message =
    error?.response?.data?.message || "Something went wrong. Please try again.";
  toast.error(message); // Show error toast
  return { status: "ERROR", message };
};

export const cognitoRequestBody = {
  clientId: "",
  userPoolId: "",
};

export const cognitoGetUser =
  ({ email, setLoading }) =>
  async (dispatch, getState) => {
    try {
      setLoading && setLoading(true);

      const url = `${process.env.VITE_apiurl}/utilities/getUser`;

      const body = { ...cognitoRequestBody, email };

      const response = await axiosInstance.post(url, body);
      dispatch(setLoginEmail(email));
      console.log("cognito get user: ", response.data);
      const findCardholder = response.data?.userAttributes?.find(
        (item) => item.name === "custom:cardholder_id"
      );
      const userId = response.data?.userAttributes?.find(
        (item) => item.name === "custom:zoqq_user_id"
      );
      //console.log("findCardholder: ", findCardholder);
      dispatch(
        setUser({
          ...response.data,
          // userId: "2ec3aaa9-1b6a-4175-883f-0c47cf264718",
          userId: userId?.value,
          cardHolderId: findCardholder?.value,
        })
      );
      // ✅ Directly fetch cardholder details
      const cardholderId = findCardholder?.value;
      console.log("Cardholder ID: rohit ", cardholderId);
      if (cardholderId) {
        // ✅ Cardholder ID mila toh fetchUser karo
        await dispatch(fetchUser(cardholderId));
      } else {
        console.warn("No cardholder ID found!");
      }
      const responseBody = {};

      if (response.data.UserStatus) {
        responseBody.success = true;
        responseBody.userStatus = response.data.UserStatus;
        responseBody.userAttributes = response.data.userAttributes;
      } else if (response.data.errorCode) {
        responseBody.success = false;
        responseBody.errorCode = response.data.errorCode;
        responseBody.message = response.data.msg;
      }

      return responseBody;
    } catch (error) {
      return handleApiError(error);
    } finally {
      setLoading && setLoading(false);
    }
  };

export const login =
  ({ email, password, setLoading }) =>
  async (dispatch, getState) => {
    const userDetails = getState().auth.user;

    try {
      setLoading(true);

      // Attempt to log the user in
      const url = `${process.env.VITE_apiurl}/utilities/signin`;

      const body = { ...cognitoRequestBody, username: email, password };

      console.log(body);

      const response = await axiosInstance.post(url, body);
      console.log("cognito sign-in: ", response.data);

      // Dispatch user to Redux
      if (response.data.errorCode) {
        return { success: false, data: response.data };
      }

      if (response.data.authenticationResult.AccessToken) {
        dispatch(setAuthenticated(true));
        dispatch(
          setUser({
            ...userDetails,
            accessToken: response.data.authenticationResult.AccessToken,
          })
        );

        let userAttr = userDetails.userAttributes;
        const userType =
          userAttr
            ?.find((item) => item?.name === "custom:userType")
            ?.value?.toLowerCase() || "individual";
        if (userType === "business") dispatch(setType("business"));
        return { success: true, data: response.data };
      }
    } catch (error) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

export const register =
  ({
    email,
    password,
    cc,
    phoneNumber,
    fullName,
    setLoading,
    type,
    businessName,
  }) =>
  async (dispatch, getState) => {
    const dnsDetails = getState().utility.dnsDetails;
    try {
      setLoading(true);

      const body = {
        ...cognitoRequestBody,
        email,
        password,
        phoneNumber: `+${cc}${phoneNumber}`,
        customAttributes: {
          agent_code: dnsDetails.agent_code,
          subagent_code: dnsDetails.subagent_code,
          contactName: type === "business" ? businessName : fullName,
          isd_code: cc,
          adminflag: "N",
          userType: type === "individual" ? "Individual" : "Business",
        },
      };

      // Attempt to log the user in
      const url = `${process.env.VITE_apiurl}/utilities/signup`;

      console.log(body);

      const response = await axiosInstance.post(url, body);
      console.log("cognito sign-up: ", response.data);

      // Dispatch user to Redux
      if (response.data.errorCode) {
        return { success: false, data: response.data };
      }

      if (response.data.ResponseMetadata.HTTPStatusCode === 200) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

export const confirmSignup =
  ({ email, otp, setLoading }) =>
  async (dispatch, getState) => {
    const userDetails = getState().auth.user;

    try {
      setLoading(true);

      // Attempt to log the user in
      const url = `${process.env.VITE_apiurl}/utilities/confirmSignup`;

      const body = { ...cognitoRequestBody, email, emailOTP: otp };

      console.log(body);

      const response = await axiosInstance.post(url, body);
      console.log("cognito confirm sign-up: ", response.data);

      // Dispatch user to Redux
      if (response.data.errorCode) {
        return { success: false, data: response.data };
      }

      if (response.data.ResponseMetadata.HTTPStatusCode === 200) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

export const forgotPassword =
  ({ email, confirmPassword, otp, setLoading }) =>
  async (dispatch) => {
    try {
      setLoading(true);
      // Attempt to log the user in
      const url = `${process.env.VITE_apiurl}/utilities/resetPassword`;

      const body = {
        ...cognitoRequestBody,
        username: email,
        newPassword: confirmPassword,
        mfacode: otp,
      };

      console.log(body);

      const response = await axiosInstance.post(url, body);
      console.log("cognito reset password: ", response.data);

      // Dispatch user to Redux
      if (response.data.errorCode) {
        return { success: false, data: response.data };
      }

      if (response.data.ResponseMetadata.HTTPStatusCode === 200) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

export const resetPassword =
  ({ email, password, confirmPassword, setLoading }) =>
  async (dispatch) => {
    try {
      setLoading(true);
      // Attempt to log the user in
      const url = `${process.env.VITE_apiurl}/utilities/resetTemporaryPassword`;

      const body = {
        ...cognitoRequestBody,
        username: email,
        tempPassword: password,
        newPassword: confirmPassword,
        challengeName: "",
      };

      console.log(body);

      const response = await axiosInstance.post(url, body);
      console.log("cognito reset temporary password: ", response.data);

      // Dispatch user to Redux
      if (response.data.errorCode) {
        return { success: false, data: response.data };
      }

      if (response.data.ResponseMetadata.HTTPStatusCode === 200) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

export const sendResetCode =
  ({ email, setLoading }) =>
  async (dispatch) => {
    try {
      setLoading(true);
      // Attempt to log the user in
      const url = `${process.env.VITE_apiurl}/utilities/forgotPassword`;

      const body = {
        ...cognitoRequestBody,
        username: email,
      };

      console.log(body);

      const response = await axiosInstance.post(url, body);
      console.log("cognito forgot password: ", response.data);

      // Dispatch user to Redux
      if (response.data.errorCode) {
        return { success: false, data: response.data };
      }

      if (response.data.ResponseMetadata.HTTPStatusCode === 200) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

export const logout =
  ({ navigation }) =>
  async (dispatch) => {
    try {
      await dispatch(resetAuthStates());
      await dispatch(resetAccountStates());
      await dispatch(resetUtilityStates());

      navigation.navigate("Home");
    } catch (e) {
      console.log("Error during logout:", e.message);
      navigation.navigate("Home");
    }
  };

// Fetch User Details
// 
// export const fetchUser = (cardholderId) => async (dispatch, getState) => {
//   try {
//     // Apne Node.js backend proxy endpoint ko hit karo
//     const url = `${process.env.VITE_API_ZOOQ}/awx/fetch-cardholder-details-awx?id=${cardholderId}`;

//     const response = await axiosInstance.get(url, {
//       headers: {
//         "x-user-id": getState().auth?.user?.userId,
//       },
//     });

//     console.log("Fetched Cardholder Details: ", response.data);

//     if (response.data.status === "success") {
//       dispatch(
//         setUserDetails({
//           cardholderDetails: response.data.data[0],
//         })
//       );
//       dispatch(setOnboarded(true));
//       return response.data;
//     } else {
//       console.warn("Cardholder details fetch failed");
//       return response.data;
//     }
//   } catch (error) {
//     return handleApiError(error);
//   }
// };


export const fetchUser = (cardholderId) => async (dispatch, getState) => {
  try {
    const url = `${process.env.VITE_API_ZOOQ}/awx/fetch-cardholder-details-awx?id=${cardholderId}`;
    console.log("👉 Fetch Cardholder URL:", url);
    console.log("📌 cardholderId:", cardholderId);
 
    const response = await axiosInstance.get(url);
 
    console.log("✅ Response:", response);
    console.log("📄 Cardholder Details:", response.data?.data?.[0]);
 
    if (response.data?.data?.[0]) {
      dispatch(setUserDetails({
        cardholderDetails: response.data.data[0],
      }));
      dispatch(setOnboarded(true));
      return response.data;
    } else {
      return { status: "ERROR", message: "No data found" };
    }
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch User Details
export const fetchBusiness = (email, type) => async (dispatch, getState) => {
  const userDetails = getState().auth?.userDetails;

  // Avoid unnecessary API calls if userDetails exist & type is "fetch"
  if (type === "fetch" && userDetails) {
    return userDetails;
  }

  try {
    const url = `${process.env.VITE_apiurl}/baas/business/${email}`;
    const response = await axiosInstance.get(url);
    console.log("Fetch business: ", response.data);

    if (response.data.status === "SUCCESS") {
      dispatch(setUserDetails(response.data)); // Save user details to Redux
      dispatch(setOnboarded(true)); // Mark user as onboarded
      return response.data;
    } else {
      // toast.error("Whoops! It looks like you haven't registered yet.");
      return response.data;
    }
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch KYC Details
export const fetchKyc = (email, type) => async (dispatch, getState) => {
  const kycDetails = getState().auth?.kycDetails;

  if (type === "fetch" || kycDetails) {
    return { ...kycDetails, status: "SUCCESS" };
  }

  try {
    const url = `${process.env.VITE_apiurl}/caas/kyc/${email}`;
    const response = await axiosInstance.get(url);

    if (response.data.kycStatus || response.data.complianceStatus) {
      dispatch(setKycDetails(response.data)); // Save KYC details to Redux
      return { ...response.data, status: "SUCCESS" };
    } else {
      throw new Error(response.data.message || "Failed to fetch KYC details");
    }
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch KYB Details
export const fetchKyb = (userId, type) => async (dispatch, getState) => {
  const kycDetails = getState().auth?.kycDetails;

  if (type === "fetch" || kycDetails) {
    return kycDetails;
  }

  try {
    const url = `${process.env.VITE_apiurl}/baas/kyb/${userId}`;
    const response = await axiosInstance.get(url);

    if (response.data.status === "SUCCESS") {
      dispatch(setKycDetails(response.data)); // Save KYC details to Redux
      return response.data;
    } else {
      toast.error(response.data.message || "Failed to fetch KYB details");
      return response.data;
    }
  } catch (error) {
    return handleApiError(error);
  }
};

//Update user details
export const updateUserDetails =
  ({ body }) =>
  async (dispatch, getState) => {
    const userDetails = getState().auth.userDetails;

    try {
      const url = `${process.env.VITE_apiurl}/caas/user/${userDetails?.id}`;
      const response = await axiosInstance.patch(url, body);

      if (response.data.status === "SUCCESS") {
        toast.success(response.data.message);
        await dispatch(fetchUser(userDetails?.email, "update")); // Save KYC details to Redux
        return response.data;
      } else {
        toast.error(response.data.message || "Failed to updated user details");
      }
    } catch (error) {
      return handleApiError(error);
    }
  };

//Update user details
export const updateBusinessDetails =
  ({ body }) =>
  async (dispatch, getState) => {
    const userDetails = getState().auth.userDetails;

    try {
      const url = `${process.env.VITE_apiurl}/baas/business/${userDetails?.id}`;
      const response = await axiosInstance.patch(url, body);

      if (response.data.status === "SUCCESS") {
        await dispatch(fetchBusiness(userDetails?.email, "update")); // Save KYC details to Redux
        toast.success(response.data.message);
        return response.data;
      } else {
        toast.error(
          response.data.message || "Failed to update business details"
        );
      }
    } catch (error) {
      return handleApiError(error);
    }
  };

// Delete user
export const deleteUserDetails =
  ({ navigation }) =>
  async (dispatch, getState) => {
    const userDetails = getState().auth?.userDetails;
    const type = getState().auth?.type;

    let urlConst = type === "business" ? "baas/business" : "caas/user";

    try {
      const url = `${process.env.VITE_apiurl}/${urlConst}/${userDetails?.id}`;
      const body = {
        userStatus: "Permanent Deactivate",
      };

      console.log(url, body);

      const response = await axiosInstance.delete(url, {
        headers: {
          "Content-Type": "application/json",
        },
        data: body,
      });

      console.log(response.data);

      if (response.data.status === "SUCCESS") {
        const user = auth.currentUser;
        await deleteUser(user);
        toast.success("User Deleted Successfully!");
        dispatch(logout({ navigation }));
        return response.data;
      } else {
        toast.error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      return handleApiError(error);
    }
  };

// Create User Details
export const createUserDetails =
  ({ body }) =>
  async (dispatch, getState) => {
    try {
      const url = `${process.env.VITE_apiurl}/caas/user`;
      const response = await axiosInstance.post(url, body);

      if (response.data.status === "SUCCESS") {
        dispatch(fetchUser(body.email));
        toast.success(response.data.message);
        return response.data;
      } else {
        toast.error(response.data.message);
        return response.data;
      }
    } catch (error) {
      return handleApiError(error);
    }
  };

// Create User Details
export const createBusinessDetails =
  ({ body }) =>
  async (dispatch, getState) => {
    try {
      const url = `${process.env.VITE_apiurl}/baas/business`;
      const response = await axiosInstance.post(url, body);

      if (response.data.status === "SUCCESS") {
        dispatch(fetchBusiness(body.email));
        toast.success(response.data.message);
        return response.data;
      } else {
        toast.error(response.data.message);
        return response.data;
      }
    } catch (error) {
      return handleApiError(error);
    }
  };
