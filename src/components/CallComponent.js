import createApiInstance from '../utils/api';


const CallComponent = ({ agentId, accessToken }) => {
  const api = createApiInstance(accessToken);
  const handleClick = async () => {
    // Prompt the user to enter a phone number
    const phoneNumber = window.prompt('Enter your phone number:');

    // Check if the user entered a phone number
    if (phoneNumber !== null && phoneNumber !== '') {
      try {
        const response = await api.post('/make_call', {
            agent_id: agentId,
            recipient_phone_number: phoneNumber
        });

        // const response = await fetch('http://localhost:8001/make_call', {
        //   method: 'POST', // or 'GET' or any other HTTP method
        //   headers: {
        //     'Content-Type': 'application/json',
        //     // Add any additional headers if needed
        //   },
        //   body: JSON.stringify({
        //     agent_id: agentId,
        //     user_id: userId,
        //     call_details: {
        //       recipient_phone_number: phoneNumber,
        //       recipient_data: "",
        //     },
        //   }),
        // });

        if (response.status != 200) {
          throw new Error('Network response was not ok');
        }

        // Handle the successful response here
        console.log('API call successful');
      } catch (error) {
        // Handle errors here
        console.error('There was an error making the API call:', error.message);
      }
    }
  };

  // Return the handleClick function
  return {
    handleClick,
  };
};

export default CallComponent;
