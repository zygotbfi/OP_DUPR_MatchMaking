const axios = require("axios");

const DUPR_API = "https://api.dupr.gg";

async function login(email, password) {
  const response = await axios.post(`${DUPR_API}/auth/v1.0/login`, {
    email,
    password,
  });

  return response.data.result;
}

async function getClubs(accessToken) {
  const response = await axios.get(`${DUPR_API}/club/roles/v1.0/all`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.results;
}

async function getMembers(accessToken, clubId) {
  let offset = 0;
  const limit = 10;
  let allPlayers = [];
  let hasMore = true;

  while (hasMore) {
    const response = await axios.post(
      `${DUPR_API}/club/${clubId}/members/v1.0/all`,
      {
        exclude: [],
        limit,
        offset,
        query: "*",
        filter: {
          lat: 6.2386725,
          lng: 125.0801068,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const result = response.data.result;

    allPlayers = [...allPlayers, ...result.hits];

    hasMore = result.hasMore;
    offset += limit;
  }

  return allPlayers;
}

module.exports = {
  login,
  getClubs,
  getMembers,
};
