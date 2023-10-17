const clientID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID
const redirectURI = "http://localhost:3000/api/auth/linkedin-callback"

const linkedin = (req, res) => {
  if (req.method === "GET") {
    const authURL =
      "https://www.linkedin.com/oauth/v2/authorization?" +
      `response_type=code&client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectURI)}` +
      "&scope=r_liteprofile%20r_emailaddress%20w_member_social" //%20r_fullprofile"

    res.redirect(authURL)
  } else {
    res.status(405).end() // Method Not Allowed
  }
}

export default linkedin
