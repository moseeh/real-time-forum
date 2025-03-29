# Start from the latest golang base image
FROM golang:latest

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files first (if you have them)
COPY go.mod go.sum* ./

# Download dependencies (if you have go.mod and go.sum)
RUN go mod download

# Copy the entire project
COPY . .

# Build the Go app
RUN go build -o main ./backend

# Expose port 8000 to the outside world
EXPOSE 8000

# Command to run the executable
CMD ["./main"]