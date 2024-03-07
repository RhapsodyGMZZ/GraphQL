export const Domain = 'https://zone01normandie.org';
const source = `${Domain}/api/graphql-engine/v1/graphql`

export const queryProjects = `{
    transaction(
    where: { type: {_eq: "xp"}, event: {path: {_eq: "/rouen/div-01"}}, path: {_nlike: "%checkpoint%", _nilike: "%piscine-js%"}}
    order_by:{createdAt:desc}
    ) {
      amount
      path
      createdAt
    }
  }
`
export const queryRatio = `{
  user{
    auditRatio
    totalUp
    totalDown
  }
}`

export const queryXP = `{
  transaction_aggregate(
  where: { type: {_eq: "xp"}, event: {path: {_eq: "/rouen/div-01"}}}
  order_by:{createdAt:desc}
  ) {
    aggregate{
      sum{
        amount
      }
    }
  }
}`

export const queryUser = `{
    user {
        id
        lastName
        firstName
      }
}`

export const queryLevel = `{
  user{
    events(where:{event:{path:{_ilike:"/rouen/div-01"}}}) {
      level
    }
  }
}`

export const fetchData = (jwt, query) => {
  try {
    return fetch(source, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
      body: JSON.stringify({ query }),
    })
      .then(async (response) => {
        const Data = await response.json()
        if (!response.ok) {
          throw new Error(Data.message);
        }
        return Data;
      })
  } catch (error) {
    console.log(error);
    throw error;
  }
}


