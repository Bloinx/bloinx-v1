import axios from "axios";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "../../supabase";

const sendRecoveryPass = async ({ mail, onSuccess, onFailure }) => {
  try {
    // Generate recovery link
    await axios
      .post(
        `${SUPABASE_URL}/admin/generate_link?apikey=${SUPABASE_SERVICE_ROLE_KEY}`,
        {
          body: {
            type: "recovery",
            email: mail,
            redirect_to: "https://bloinx.app/forgot-password",
          },
        }
      )
      .then(async (response) => {
        const { link } = response.data.action_link;
        onSuccess(response.data);
        console.log("link", link);

        axios.post(
          "https://wtb2taazv8.execute-api.us-east-2.amazonaws.com/mandarMail/sendMail",
          {
            personalizations: [
              {
                to: [
                  {
                    email: mail,
                  },
                ],
                dynamic_template_data: {
                  user: mail,
                  title: "Recovery Password Bloinx",
                  link: "https://bloinx.app/forgot-password",
                  name: "Bloinx Team",
                  recoveryLink: `${link}`,
                },
                subject: "Recovery Password Bloinx",
              },
            ],
          }
        );
      });
  } catch (error) {
    console.error("Error sending recovery email:", error);
    onFailure(error);
  }
};

export default sendRecoveryPass;
