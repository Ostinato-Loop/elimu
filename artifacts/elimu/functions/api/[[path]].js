const ALB_URL = "http://elimu-api-alb-1846466725.eu-west-1.elb.amazonaws.com";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const targetUrl = ALB_URL + url.pathname + url.search;

  const headers = new Headers(context.request.headers);
  headers.set("X-Forwarded-Host", url.hostname);
  headers.set("X-Forwarded-Proto", "https");

  const init = {
    method: context.request.method,
    headers,
    redirect: "manual",
  };

  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    init.body = context.request.body;
    init.duplex = "half";
  }

  const response = await fetch(targetUrl, init);

  const responseHeaders = new Headers(response.headers);
  responseHeaders.set("Access-Control-Allow-Origin", "https://elimu.rald.cloud");
  responseHeaders.set("Access-Control-Allow-Credentials", "true");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}
