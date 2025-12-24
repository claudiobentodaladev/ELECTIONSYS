create table users(
	id bigint auto_increment not null,
    email varchar(255) unique not null,
    password_hash text not null,
    role enum("admin","eleitor"),
    created_at date default (current_date),
    primary key(id)
);

create table profile(
	id bigint auto_increment not null,
    user_id bigint not null,
    name varchar(25) not null,
    surname varchar(75) not null,
    photo text,
    sex enum('m','f') not null,
    born_date date not null,
    primary key(id),
    foreign key(user_id) references users(id)
);

create table elections(
	id bigint auto_increment not null,
    user_id bigint not null,
    title varchar(80) not null,
    description text,
    start_at datetime not null,
    end_at datetime not null,
    status boolean default true,
    primary key(id),
    foreign key(user_id) references users(id)
);
alter table elections add constraint check_date check (start_at < end_at);

create table participation(
	id bigint auto_increment not null,
    user_id bigint not null,
    election_id bigint not null,
    status boolean default false,
    primary key(id),
    foreign key(user_id) references users(id),
    foreign key(election_id) references elections(id)
);

create table candidates(
	id bigint auto_increment not null,
    user_id bigint not null,
    election_id bigint not null,
    group_name varchar(35) not null,
    description text,
    status boolean default false,
    created_at datetime default (current_date),
    primary key(id),
    foreign key(user_id) references users(id),
    foreign key(election_id) references elections(id)
);

create table candidates_propose(
	id bigint auto_increment not null,
    candidate_id bigint not null,
    title varchar(35) not null,
    body text not null,
    primary key(id),
    foreign key(candidate_id) references candidates(id)
);

create table propose_comentary(
	id bigint auto_increment not null,
    user_id bigint not null,
    candidates_propose_id bigint not null,
    rating enum('1','2','3','4','5') not null,
    comentay text not null,
    primary key(id),
    foreign key(user_id) references users(id),
    foreign key(candidates_propose_id) references candidates_propose(id)
);

create table vote(
	id bigint auto_increment not null,
    election_id bigint not null,
    candidate_id bigint not null,
    user_id bigint not null,
    created_at datetime default (current_date),
    primary key(id),
    foreign key(election_id) references elections(id),
    foreign key(candidate_id) references candidates(id),
    foreign key(user_id) references users(id)
);
alter table vote add constraint unique_user_voting unique(user_id,election_id);

CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    action enum("VOTE_CAST","VOTE_ATTEMPT_DUPLICATE","ELECTION_CREATED","ELECTION_CLOSED") NOT NULL,
    entity_type enum("user","admin"),
    election_id bigint not null,
    candidate_id bigint not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key(user_id) references users(id),
    foreign key(election_id) references elections(id),
    foreign key(candidate_id) references candidates(id)
);