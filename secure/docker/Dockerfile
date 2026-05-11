FROM node:20-alpine

# Install dependencies required for our real scanners (Nmap and Nuclei)
RUN apk add --no-cache nmap

# Install Nuclei by downloading the binary
RUN wget https://github.com/projectdiscovery/nuclei/releases/download/v3.1.6/nuclei_3.1.6_linux_amd64.zip -O nuclei.zip && \
    unzip nuclei.zip -d /usr/local/bin/ && \
    rm nuclei.zip && \
    chmod +x /usr/local/bin/nuclei && \
    nuclei -update-templates

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]