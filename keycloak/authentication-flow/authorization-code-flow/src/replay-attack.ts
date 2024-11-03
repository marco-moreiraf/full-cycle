const url =
  "http://host.docker.internal:3000/callback?session_state=a49f1330-80d1-4f48-87e1-359c03b95191&code=992b83e6-6eab-42a5-9e94-6e6cf1ab05a8.a49f1330-80d1-4f48-87e1-359c03b95191.670e1d26-1523-4422-95a8-634fe497c2d4";

const request1 = fetch(url);
const request2 = fetch(url);

Promise.all([request1, request2])
  .then(async (responses) => {
    return Promise.all(responses.map((response) => response.json()));
  })
  .then((jsons) => console.log(jsons));
