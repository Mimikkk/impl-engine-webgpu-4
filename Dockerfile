FROM denoland/deno:2.3.3 AS base
WORKDIR /app

COPY deno.json deno.lock ./
COPY apps/preview/deno.json ./apps/preview/
COPY libs/engine/deno.json ./libs/engine/

RUN deno cache --lock=deno.lock deno.json
RUN deno install --allow-scripts

FROM base AS development

COPY . .
EXPOSE 3000

CMD ["deno", "task", "dev:preview"]

FROM base AS builder

COPY . .
RUN deno task build:preview

FROM nginx:alpine AS production

COPY --from=builder /app/apps/preview/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 
