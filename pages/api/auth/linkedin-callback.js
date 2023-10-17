// pages/api/auth/linkedin-callback.js

import axios from "axios"

const clientID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID
const clientSecret = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_SECRET
const redirectURI = "http://localhost:3000/api/auth/linkedin-callback"

const linkedin_callback = async (req, res) => {
  if (req.method === "GET") {
    const code = req.query.code

    try {
      const response = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", null, {
        params: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirectURI,
          client_id: clientID,
          client_secret: clientSecret,
        },
      })

      const accessToken = response.data.access_token

      // Fetch basic profile info
      const profileResponse = await axios.get("https://api.linkedin.com/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Fetch email address
      const emailResponse = await axios.get(
        "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      // Fetch job experiences (you need r_fullprofile permission for this)
      // const positionsResponse = await axios.get(
      //   "https://api.linkedin.com/v2/positions?projection=(elements*(*,company*(name)))",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   }
      // )

      // Aggregate the responses
      const userData = {
        profile: profileResponse.data,
        email: emailResponse.data, //.elements[0]["handle~"].emailAddress,
        // positions: positionsResponse.data.elements,
      }

      res.json(userData)
    } catch (error) {
      console.error("Error:", error)
      res.status(500).send("An error occurred.")
    }
  } else {
    res.status(405).end() // Method Not Allowed
  }
  if (req.method === "GET") {
    const code = req.query.code

    try {
      const response = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", null, {
        params: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirectURI,
          client_id: clientID,
          client_secret: clientSecret,
        },
      })

      const accessToken = response.data.access_token
      const profileResponse = await axios.get("https://api.linkedin.com/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      res.json(profileResponse.data)
    } catch (error) {
      console.error("Error:", error)
      res.status(500).send("An error occurred.")
    }
  } else {
    res.status(405).end() // Method Not Allowed
  }
}

export default linkedin_callback
