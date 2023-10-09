export const fetchAgreements = async (details) => {
    try {
      const userAgreementIds = await details.contract.getUserAgreements(details.account)
      if (userAgreementIds.length === 0) return null;

      const stringIds = userAgreementIds.map((id) => id.toString())

      const fetchedAgreements = await Promise.all(
        stringIds.map(async (agreementId) => {
          const agreement = await details.contract.getAgreementById(agreementId)
          return agreement
        })
      )

      return fetchedAgreements
    } catch (error) {
      console.error("Error when fetching agreements:", error)
    }
  }

export default fetchAgreements;