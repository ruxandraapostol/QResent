# QResent

The application uses Postgres as a database, and it will run on:     
http://localhost:8085


Available endpoints:

### Test endpoint

- **/QResent/test** -> to verify if the app is running correctly; should return "it's working"

### Professors

- **/QResent/professors** -> returns a list of all professors

- **/QResent/getProfessorByLdap/{ldap}** -> returns a professor that has the specified ldap

- **/QResent/addProfessor** -> add a new professor; the request accepts application/json as content type
-

```json
{
  "firstName": "Cornel",
  "lastName": "Popescu",
  "ldap": "cornel.p"
}
```

### Subjects

- **/QResent/subjects** -> returns a list of all subjects

- **/QResent/getSubjectByLdap/{ldap}** -> returns a list of all subjects where the assigned professor has the specified
  ldap

- **/QResent/addSubject** -> add a new subject; the request accepts application/json as content type

```json
{
  "name": "SMP",
  "description": "Sisteme cu microprocesoare",
  "professorLdap": "c.pop",
  "points": "6pcte parcurs(labs + teme) + 4pcte examen",
  "intervals": [
    {
      "name": "Curs 1",
      "date": "01.11.2017",
      "hours": "10:00 - 12:00"
    },
    {
      "name": "Curs 2",
      "date": "07.11.2017",
      "hours": "14:00 - 16:00"
    },
    {
      "name": "Curs 3",
      "date": "14.11.2017",
      "hours": "10:00 - 12:00"
    }
  ]
}
```

- **/QResent/editSubject/{subjectName}** -> edit the specified subject
-

```json
{
  "name": "CN",
  "description": "Calculatoare Numerice",
  "professorLdap": "nirvana.popescu"
}
```

- **/QResent/deleteSubject/{subjectName}** -> delete a subject with the specified name

- **/QResent/getIntervals/{subjectName}** -> get intervals for the specified subject

- **/QResent/addInterval/{subjectName}** -> add a new interval for the specified subject

```json
{
  "name": "Curs 1",
  "date": "02.11.2017",
  "hours": "12:00 - 14:00",
  "subjectName": "CN"
}
```

- **/QResent/editInterval/{subjectName}/{intervalName}** -> edit the specified interval from the specified subject

```json
{
  "name": "Curs 3",
  "date": "16.11.2017",
  "hours": "08:00 - 10:00",
  "subjectName": "CN"
}
```

- **/QResent/deleteInterval/{subjectName}** -> delete an interval(body) for the specified subject

```json
{
  "name": "Curs 1",
  "date": "02.11.2017",
  "hours": "12:00 - 14:00",
  "subjectName": "CN"
}
```

### Token

- **/getToken/{subjectName}/{intervalName}** -> returns a token(random string) for the specified subject and interval

- **/scannedQR/{token}** -> returns the data saved when the token was created

```text
anca_mihaela.enache
```

- **/disableToken/{token}** -> disable a token

- **/deleteToken/{token}** -> delete a token when expires

- **/QResent/getAttendanceList/{subjectName}/{intervalName}** -> returns the attendance List for the specified subject
  and interval

```json
[
  {
    "id": 2,
    "firstName": "Ruxandra",
    "lastName": "Apostol",
    "clazz": "42",
    "ldap": "ruxandra.apostol"
  },
  {
    "id": 1,
    "firstName": "Anca",
    "lastName": "Enache",
    "clazz": "41",
    "ldap": "anca_mihaela.enache"
  }
]
```

- **/QResent/getTokenScannedCount/{token}** -> returns how many times the token was scanned

### Users

- **/QResent/users** -> returns a list of all subjects users

- **/QResent/getUserByLdap/{ldap}** -> returns a user that has the specified ldap

- **/QResent/addUser** -> add a new user

```
{
    "ldap": "cornel.popescu",
    "userRole": "p",
    "firstName": "Cornel",
    "lastName": "Popescu",
    "clazz": null,     -> eg: 341C2 for students
    "currentYear": null,     -> eg: 1/2/3 or 4 for students
    "userPassword": "1234",
    "contact": "cornel.popescu@cs.pub.ro",
    "loggedIn": false
}
```

- **/QResent/login** -> login a user

```json
{
  "ldap": "cornel.popescu",
  "userPassword": "1234"
}
```

- **/QResent/logout** -> logout a user

```json
{
  "ldap": "cornel.popescu"
}
```

- **/QResent/changePassword** -> change password after login

```
{
    "ldap":"cornel.popescu",
    "oldUserPassword":"1111",        -> verify the current password before change
    "userPassword":"1234"
}
```

- **/QResent/updateUser/{ldap}** -> update the specified user

```json
{
  "firstName": "Ruxandra",
  "lastName": "Apostol",
  "clazz": "1",
  "ldap": "rux.apostol"
}
```

- **/QResent/deleteUser** -> delete user

```json
{
  "ldap": "cornel.popescu"
}
```

# Setup

To run it on your device you can use the docker image of Postgres:

- **docker pull postgres**
- **docker run --name qresent-postgres -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres**
- **docker exec -it qresent-postgres bash** (to access the cli of the postgres)
- **su postgres**
- **psql**
- **create database "qresentdb";**

The app is using JAVA 1.8 and Maven

# Our journal
Link: https://docs.google.com/document/d/1yp3RgXIrtGOfPVumAPi_p_n8K0QbRq4wuvz-Xj49YQE/edit?usp=sharing
