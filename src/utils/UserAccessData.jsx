export const accessData = (user) => {
    if (user?.isSubscribed === true) {
      return true; // Subscribed users always have access
    } else {
      const staticReferenceDate = new Date(); // Current date and time
      let createdDate = user?.created_at;
  
      if (!createdDate) {
        console.log("User creation date is missing.");
        return false; // No access if creation date is missing
      }
  
      // Convert createdDate to a Date object if it's a string
      let userCreationDate = new Date(createdDate);
  
      // Check if the date conversion was successful
      if (isNaN(userCreationDate.getTime())) {
        console.log("Invalid user creation date format.");
        return false; // No access if date format is invalid
      }
  
      const differenceInMilliseconds = staticReferenceDate - userCreationDate;
      const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
  
      console.log(createdDate, 'differenceInDays:', differenceInDays);
      return differenceInDays <= 15; // Access granted if within 15 days of creation
    }
  };