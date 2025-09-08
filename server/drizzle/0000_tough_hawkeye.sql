CREATE TABLE "wines" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"reviewCount" integer NOT NULL,
	"score" numeric NOT NULL,
	"link" varchar(255) NOT NULL,
	"searchTerm" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
