let current = 0;

interface apiResponse {
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

const images: { data: apiResponse; blob: Blob }[] = [];

export const fetchApi = async (): Promise<apiResponse> => {
  let fullUrl = `${import.meta.env.VITE_API_URL}`;
  if (current !== 0) {
    fullUrl += `&count=${current}`;
    current++;
  }

  const data = await fetch(fullUrl).then((x) => x.json());

  return data;
};

export const getIndex = async (index: number) => {
  if (images.length > index) {
    return { data: images[index], index };
  }

  const info = await fetchApi();

  const blob = await fetch(`${import.meta.env.VITE_API_URL}/image`, {
    method: "POST",
    body: JSON.stringify({
      url: info.hdurl,
    }),
    headers: {
      "content-type": "application/json",
    },
  }).then((x) => x.blob());

  const data = { data: info, blob };

  return { data, index: images.push(data) };
};
