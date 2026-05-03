import Database from "better-sqlite3";

export interface Detail {
    domain: string,
    company: string,
    duration: string,
    location: string,
    stipend: string,
    applicants: string
}

export const internshala_db = new Database("internshala.db");

internshala_db.prepare(`
    create table if not exists internships(
        id integer primary key autoincrement,
        domain text,
        company text,
        duration text,
        location text,
        stipend text,
        applicants text,
        created_at datetime default current_timestamp
    )    
`).run();

export function saveDetails(data: Detail[]){
    const query = internshala_db.prepare(`
        insert into internships
        (domain, company, duration, location,stipend,applicants)
        values (?,?,?,?,?,?)
    `)

    data.forEach(internship => {

        query.run(
            internship.domain,
            internship.company,
            internship.duration,
            internship.location,
            internship.stipend,
            internship.applicants
        );
    });
}

