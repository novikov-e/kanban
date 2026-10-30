insert into users (user_id, firstname, lastname, date_of_birth, sex, email, password)
values ('dae65e27-b1f8-432f-bed3-d8a3fb812ccb', 'Егор', 'Новиков', '1990-01-31', 'M', 'noved256@gmail.com', 'password')
on conflict do nothing;

insert into projects (project_id, user_id, project_name, project_position)
values ('c4188f60-018c-4038-8feb-3773e543bd8c','dae65e27-b1f8-432f-bed3-d8a3fb812ccb','Демонстрация',0)
on conflict do nothing;



insert into columns (column_id, project_id, column_name, column_position)
values ('2e9a967e-d457-4c90-8c5f-afd96fbe4218','c4188f60-018c-4038-8feb-3773e543bd8c','Возможности',0)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('5d6df5bb-9280-46b9-94c9-cecf57ddf5b4','2e9a967e-d457-4c90-8c5f-afd96fbe4218','Перемещение элементов',1,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('7733aeda-7275-4371-9aeb-d5667c85fb7a','5d6df5bb-9280-46b9-94c9-cecf57ddf5b4','Перемещение задач между списками',true,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('925ce72f-ab1b-4400-a4d9-66cd26566fed','5d6df5bb-9280-46b9-94c9-cecf57ddf5b4','Перемещение  колонок внутри проекта',true,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('8d2c2624-7d9a-4db7-bee7-0a3fe8d36518','5d6df5bb-9280-46b9-94c9-cecf57ddf5b4','Перемещение списков между колонками',true,1)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('ecfa1757-40c1-47b2-988b-be13dfa34a7b','2e9a967e-d457-4c90-8c5f-afd96fbe4218','Горячие клавиши',2,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('1e26c335-b27d-4ab6-8671-7f74e43adac8','ecfa1757-40c1-47b2-988b-be13dfa34a7b','По нажатию на Esc выход из режима редактирования',true,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('76fde1e7-6ba7-4604-bba0-b3dd9813ab9e','ecfa1757-40c1-47b2-988b-be13dfa34a7b','При именовании списка, по нажатию на Ctrl + Enter происходит переход к  наполнению задачами',true,0)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('9faddd0e-1e9b-4fd4-9b5d-4573e3ad75cb','2e9a967e-d457-4c90-8c5f-afd96fbe4218','Выделение списков цветом',3,1)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('125890d9-6955-4109-bfed-71ef513bb62d','2e9a967e-d457-4c90-8c5f-afd96fbe4218','Красный',4,2)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('99077532-c20b-4e47-972b-3f1a088ad518','2e9a967e-d457-4c90-8c5f-afd96fbe4218','Розовый',5,3)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('1e25c39c-20c9-4dd1-91a3-1fbe01f97c18','2e9a967e-d457-4c90-8c5f-afd96fbe4218','Оранжевый',6,4)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('c6a003f4-f571-4a80-ad74-9f01849b6e41','2e9a967e-d457-4c90-8c5f-afd96fbe4218','Зелёный',7,5)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('3f6d6175-605a-42d1-84ac-530dea8a73d9','2e9a967e-d457-4c90-8c5f-afd96fbe4218','Сине-зелёный',8,6)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('cbb5d781-5168-426f-84cf-49a03cbfe43e','2e9a967e-d457-4c90-8c5f-afd96fbe4218','Синий',9,7)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('edd38f52-d936-4191-92b2-6a36c8a97a1b','2e9a967e-d457-4c90-8c5f-afd96fbe4218','Фиолетовый',10,8)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('c06f4fe9-5209-4e82-aa10-3c0fb00dba89','2e9a967e-d457-4c90-8c5f-afd96fbe4218','Темы',0,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('03ec597c-240f-4828-bdcb-7a5f5a115b81','c06f4fe9-5209-4e82-aa10-3c0fb00dba89','Светлая',true,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('a60fd40c-78b5-46d4-9daa-fc3ec76bc48c','c06f4fe9-5209-4e82-aa10-3c0fb00dba89','Тёмная',true,1)
on conflict do nothing;




insert into columns (column_id, project_id, column_name, column_position)
values ('8c74b06d-6a91-4484-80ef-3bb20ec55990','c4188f60-018c-4038-8feb-3773e543bd8c','Вторая колонка',1)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('544c1d75-16e8-4289-881b-31eaf961f7be','8c74b06d-6a91-4484-80ef-3bb20ec55990','Розовый список',1,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('51697615-512e-4485-83e8-dd17e2e40aea','544c1d75-16e8-4289-881b-31eaf961f7be','Вторая розовая задача',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('19fe2489-3704-4fdb-bb4b-c7958313169e','544c1d75-16e8-4289-881b-31eaf961f7be','Предпоследняя розовая задача',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('fccdaa84-6135-4ece-8186-ee38474d6311','544c1d75-16e8-4289-881b-31eaf961f7be','Последняя розовая задача',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('7a597792-34fd-4456-88b1-0e8d1b4b9798','544c1d75-16e8-4289-881b-31eaf961f7be','Розовая задача номер один',false,0)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('9d57e254-f3bf-48f9-9903-3afeaaad0b3e','8c74b06d-6a91-4484-80ef-3bb20ec55990','Ещё один простой список',2,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('7d1526db-f307-49c9-b2ec-879b23156093','9d57e254-f3bf-48f9-9903-3afeaaad0b3e','Задача полегче',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('a95d7740-511b-4dcb-bcb4-9c614527a1cb','9d57e254-f3bf-48f9-9903-3afeaaad0b3e','Невероятно интересная задача',false,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('bfd25cbf-fc0f-4d25-9d82-4b4d231c94d5','9d57e254-f3bf-48f9-9903-3afeaaad0b3e','Трудная задача',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('ce3ee226-9eae-4332-8003-75a3e79888a2','9d57e254-f3bf-48f9-9903-3afeaaad0b3e','Очень важная задача',false,7)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('29e09fae-3b46-4786-be20-591d0dcb86ef','9d57e254-f3bf-48f9-9903-3afeaaad0b3e','Ещё одна тяжёлая задача',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('b74bed96-185f-410a-b47e-c81e398655eb','9d57e254-f3bf-48f9-9903-3afeaaad0b3e','Очень увлекательная задача',false,5)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('818a179e-a15f-48ff-9810-aca0c3cbd023','9d57e254-f3bf-48f9-9903-3afeaaad0b3e','Задача на пару минут',false,6)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('3e60b86f-b2c2-43ce-87ee-44c865db906e','9d57e254-f3bf-48f9-9903-3afeaaad0b3e','Срочная задача',false,8)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('c70b6880-a7c7-49bb-b3bc-7ee2d448fbfe','9d57e254-f3bf-48f9-9903-3afeaaad0b3e','Простенькая задачка',false,2)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('04f2f30b-f6db-4e0b-be20-839bd8d5299f','8c74b06d-6a91-4484-80ef-3bb20ec55990','Синий список',3,7)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('fe218e07-d6bf-4146-b06b-1166b855a475','04f2f30b-f6db-4e0b-be20-839bd8d5299f','Ещё одна быстрая синяя задачка',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('0a543b72-1785-4e5b-8589-4f30c1199f0b','04f2f30b-f6db-4e0b-be20-839bd8d5299f','Тоже синяя задача не из лёгких',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('d01ef74c-508e-4eaa-bf35-7c5a6f21aeb9','04f2f30b-f6db-4e0b-be20-839bd8d5299f','Непростая синяя задача',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('f2a13f1e-9521-4d65-afdb-3a9e017a0ca0','04f2f30b-f6db-4e0b-be20-839bd8d5299f','Очень интересная синяя задача',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('80ee99af-0ae9-4acb-8c4a-9247c191de45','04f2f30b-f6db-4e0b-be20-839bd8d5299f','Срочная синяя задача',false,4)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('2b513e44-0506-4f5e-98b0-095c1c5794c3','8c74b06d-6a91-4484-80ef-3bb20ec55990','Простой список',0,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('f326ee90-1992-4b05-973c-f176bf8bda6d','2b513e44-0506-4f5e-98b0-095c1c5794c3','Ещё одна задача',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('a7dce441-3c80-448e-8df2-ee008e65f2ef','2b513e44-0506-4f5e-98b0-095c1c5794c3','Последняя задача',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('4947dfe2-c795-4f7e-80e2-ac94ad5f4de4','2b513e44-0506-4f5e-98b0-095c1c5794c3','Задача номер два',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('641c3f41-9e41-4222-8c85-9a61ebb3e97a','2b513e44-0506-4f5e-98b0-095c1c5794c3','Первая задача',false,0)
on conflict do nothing;




insert into columns (column_id, project_id, column_name, column_position)
values ('3d69600c-283d-4de6-bbc2-261f37ad3db1','c4188f60-018c-4038-8feb-3773e543bd8c','Третья колонка',2)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('be8802f8-ebc5-432c-a0a4-9c926f3f8fc7','3d69600c-283d-4de6-bbc2-261f37ad3db1','Оранжевый список',1,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('adb0aac5-4ce6-494a-89f9-5d07cdabe132','be8802f8-ebc5-432c-a0a4-9c926f3f8fc7','Последняя оранжевая задача',false,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('f83b4436-b9b1-4a0d-b9b1-e8a5a3e00038','be8802f8-ebc5-432c-a0a4-9c926f3f8fc7','Очень интересная, а главное увлекательная оранжевая задача',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('d0e65fd1-3617-494a-8503-026ff58c17a9','be8802f8-ebc5-432c-a0a4-9c926f3f8fc7','Задача оранжевого цвета требующая особой точности',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('53ccc794-1dc0-4f87-8ac3-1757fcceca77','be8802f8-ebc5-432c-a0a4-9c926f3f8fc7','Неотложная оранжевая задача',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('e640ebc0-34f6-400a-9bf2-2f39780f862b','be8802f8-ebc5-432c-a0a4-9c926f3f8fc7','Давно забытая, но очень важная оранжевая задача',false,1)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('d679b61b-c54f-4510-aa71-5633f00ef6b7','3d69600c-283d-4de6-bbc2-261f37ad3db1','Фиолетовый список',2,8)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('70ad7119-0283-4415-9e54-39d74fcc59db','d679b61b-c54f-4510-aa71-5633f00ef6b7','Последняя фиолетовая задача',false,5)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('2f0931ac-4768-464e-87b8-c270f5f94a75','d679b61b-c54f-4510-aa71-5633f00ef6b7','Тоже фиолетовая   задача не из лёгких',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('0d179c33-cb2d-4c86-b94d-fdec64d7a81f','d679b61b-c54f-4510-aa71-5633f00ef6b7','Задача на пару минут фиолетового цвета',false,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('040cb98d-74ed-4881-8434-d631bc5a57cc','d679b61b-c54f-4510-aa71-5633f00ef6b7','Первая фиолетовая задача',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('442ca779-f3bd-496c-a269-47c7336cf28f','d679b61b-c54f-4510-aa71-5633f00ef6b7','Фиолетовая задача номер два',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('dee0c5e5-ac1f-4444-9ecd-f320c802095e','d679b61b-c54f-4510-aa71-5633f00ef6b7','Невероятно интересная фиолетовая задача',false,2)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('9ab3f7c1-6662-4651-99a1-7ef76df5e3fe','3d69600c-283d-4de6-bbc2-261f37ad3db1','И ещё один простой список',0,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('716bfac3-c800-4e62-bb0b-d0a5ff9a76e7','9ab3f7c1-6662-4651-99a1-7ef76df5e3fe','Ну и наконец это',false,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('67580420-0747-4dcf-a443-5af352461096','9ab3f7c1-6662-4651-99a1-7ef76df5e3fe','Надо сделать это',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('decadf2a-3662-45e0-91ac-0c6866ba221f','9ab3f7c1-6662-4651-99a1-7ef76df5e3fe','Потом ещё это',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('00239e7f-0de2-4372-b875-a79c69c01694','9ab3f7c1-6662-4651-99a1-7ef76df5e3fe','Ещё вот это',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('dbf04203-c181-4c5e-a78a-88b7185fe2d9','9ab3f7c1-6662-4651-99a1-7ef76df5e3fe','Не забыть про это',false,3)
on conflict do nothing;

--------------------------
insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('cc8f1ffe-b079-4bfd-810b-82be9db4bdfc','3d69600c-283d-4de6-bbc2-261f37ad3db1','Ещё один простой список',3,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('96b8c27e-864e-4270-8729-6cab39318bb8','cc8f1ffe-b079-4bfd-810b-82be9db4bdfc','Задача полегче',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('be59c3ea-17cb-4c7c-b3dd-a61ec6e306a2','cc8f1ffe-b079-4bfd-810b-82be9db4bdfc','Невероятно интересная задача',false,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('1753008e-8c47-492e-bb88-f31494905224','cc8f1ffe-b079-4bfd-810b-82be9db4bdfc','Трудная задача',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('b5953a33-d105-48e5-9a22-7f02f341200f','cc8f1ffe-b079-4bfd-810b-82be9db4bdfc','Очень важная задача',false,7)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('0a6267c4-f419-4ef8-97de-800299eceeee','cc8f1ffe-b079-4bfd-810b-82be9db4bdfc','Ещё одна тяжёлая задача',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('a25d7e08-9126-40ee-8bbc-a1b5a276ad1a','cc8f1ffe-b079-4bfd-810b-82be9db4bdfc','Очень увлекательная задача',false,5)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('59888d63-eed1-4d17-a61b-2977bc0f6eeb','cc8f1ffe-b079-4bfd-810b-82be9db4bdfc','Задача на пару минут',false,6)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('3e60b86f-b2c2-43ce-87ee-44c865db906e','cc8f1ffe-b079-4bfd-810b-82be9db4bdfc','Срочная задача',false,8)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('437fac9b-7d6e-4fe9-b12b-05ea65ee5552','cc8f1ffe-b079-4bfd-810b-82be9db4bdfc','Простенькая задачка',false,2)
on conflict do nothing;

---------------------


insert into columns (column_id, project_id, column_name, column_position)
values ('b8f684cb-3ff5-489f-99f4-334309d43cd4','c4188f60-018c-4038-8feb-3773e543bd8c','Четвёртая колонка',3)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('3640f677-5b22-4a70-9b7c-621447f01a00','b8f684cb-3ff5-489f-99f4-334309d43cd4','Зелёный список',0,5)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('4772bac2-dd44-4052-bc5e-8fec8802f58e','3640f677-5b22-4a70-9b7c-621447f01a00','Простенькая зелёная задачка',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('2e876320-201f-431c-bb94-ca4a2508655b','3640f677-5b22-4a70-9b7c-621447f01a00','Срочная зелёная задача',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('ac61b3ec-fd33-434d-ad03-0d5f2897ce21','3640f677-5b22-4a70-9b7c-621447f01a00','Неотложная зелёная задача',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('adc86477-c523-47c1-a52a-59516466028b','3640f677-5b22-4a70-9b7c-621447f01a00','Очень увлекательная зелёная задача',false,1)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('af602cb4-4749-4925-a6d4-829a1efa6f57','b8f684cb-3ff5-489f-99f4-334309d43cd4','Тоже простой список',1,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('59760111-1a81-453d-b7dc-86a0073e7ca0','af602cb4-4749-4925-a6d4-829a1efa6f57','Потом ещё это',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('9d1e91ec-28ec-4a21-9e2c-64c17af63542','af602cb4-4749-4925-a6d4-829a1efa6f57','И это тоже придётся сделать',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('c94ca839-b4cf-4a28-93a7-1cadc0aec67e','af602cb4-4749-4925-a6d4-829a1efa6f57','Ещё вот это',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('484b793b-993f-47cb-84f4-edf486cfe79e','af602cb4-4749-4925-a6d4-829a1efa6f57','Не забыть про это',false,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('983dcd91-a72f-4245-9cb1-d006591da452','af602cb4-4749-4925-a6d4-829a1efa6f57','Ну и наконец это',false,6)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('8514cd7b-6036-4b44-9042-74ec6213263b','af602cb4-4749-4925-a6d4-829a1efa6f57','Надо сделать это',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('f93c9313-6037-4a14-bbc5-fdf37633c882','af602cb4-4749-4925-a6d4-829a1efa6f57','Ну и конечно же вот это',false,5)
on conflict do nothing;


insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('38455609-9005-4340-b180-3e3332de1ae8','b8f684cb-3ff5-489f-99f4-334309d43cd4','Красный список',2,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('8194b346-7f66-4cc8-8519-1332aa7e22dd','38455609-9005-4340-b180-3e3332de1ae8','Красная задача на пару минут',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('755b5b68-296d-46a3-8af9-ee328e194807','38455609-9005-4340-b180-3e3332de1ae8','Задача красного цвета требующая особой точности',false,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('2957e909-22a8-4a28-8a72-b903a58a933b','38455609-9005-4340-b180-3e3332de1ae8','Срочная красная задача',false,5)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('7ae0baa3-ff45-4dd3-863a-492a2accc3d5','38455609-9005-4340-b180-3e3332de1ae8','Очень увлекательная красная задача',false,6)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('ea756aa0-80a5-45ef-af52-c02e91fa5d47','38455609-9005-4340-b180-3e3332de1ae8','Красная задача полегче',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('a0c05540-97f8-43b2-b03e-f50c6ceed752','38455609-9005-4340-b180-3e3332de1ae8','Неотложная красная задача',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('6cdbd035-9acd-4c75-9fa9-b0ccac72dcf1','38455609-9005-4340-b180-3e3332de1ae8','Трудная красная задача',false,1)
on conflict do nothing;




insert into columns (column_id, project_id, column_name, column_position)
values ('a5c7e23d-4d85-42a4-87e2-75eb0e7cb6c9','c4188f60-018c-4038-8feb-3773e543bd8c','Пятая колонка',4)
on conflict do nothing;

----------------------

insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('7e406238-62b2-492f-b6c8-bd690d672e47','a5c7e23d-4d85-42a4-87e2-75eb0e7cb6c9','Ещё один простой список',0,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('97fe0809-1575-40e3-8010-8056a4ca32cc','7e406238-62b2-492f-b6c8-bd690d672e47','Задача полегче',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('dcf310b5-de1b-4f2f-aedf-67c06f9f7b70','7e406238-62b2-492f-b6c8-bd690d672e47','Невероятно интересная задача',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('f84bab17-3fc5-4c92-952a-75b2bc1c7099','7e406238-62b2-492f-b6c8-bd690d672e47','Трудная задача',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('b54fe105-b078-4add-8480-8bc3afabab43','7e406238-62b2-492f-b6c8-bd690d672e47','Очень важная задача',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('da74009b-b18f-45c1-8ba0-31d0fbc1e62f','7e406238-62b2-492f-b6c8-bd690d672e47','Ещё одна тяжёлая задача',false,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('12811dc8-fba3-4b9e-9f7f-aac86e445fbc','7e406238-62b2-492f-b6c8-bd690d672e47','Очень увлекательная задача',false,5)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('37465f41-298f-4b30-9b91-d4c73666f1ba','7e406238-62b2-492f-b6c8-bd690d672e47','Задача на пару минут',false,6)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('c8971b9c-a155-4ffc-8f26-7ef2f5837ce3','7e406238-62b2-492f-b6c8-bd690d672e47','Срочная задача',false,7)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('dbde8e23-b6de-4850-80ed-91e00c8253f4','7e406238-62b2-492f-b6c8-bd690d672e47','Простенькая задачка',false,8)
on conflict do nothing;
------------------------------------

insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('1190659b-2c30-4443-bfc5-705b653f9b1f','a5c7e23d-4d85-42a4-87e2-75eb0e7cb6c9','Сине-зелёный список',1,6)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('ca4d1756-2240-4040-a30c-6d9f73af58b3','1190659b-2c30-4443-bfc5-705b653f9b1f','Последняя сине-зелёная задача',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('5277b2d4-735b-44f0-b2b3-9200eda6dc8b','1190659b-2c30-4443-bfc5-705b653f9b1f','Очень важная сине-зелёная задача',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('f5386942-8ddf-431e-a27c-a4357a437abd','1190659b-2c30-4443-bfc5-705b653f9b1f','Тяжёлая сине-зелёная задача',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('8fe22c5c-0f00-4b3a-a0d4-d8add0df32d9','1190659b-2c30-4443-bfc5-705b653f9b1f','Интересная сине-зелёная задача',false,1)
on conflict do nothing;


------------------------------------
insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('33540dd5-c498-43e5-aef4-61f8ea86aebe','a5c7e23d-4d85-42a4-87e2-75eb0e7cb6c9','Ещё один простой список',2,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('cb2f36eb-66a0-44ff-8977-030785a61ba9','33540dd5-c498-43e5-aef4-61f8ea86aebe','Трудная задача',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('5499202a-31fd-4760-a86c-9e4cd4722b1c','33540dd5-c498-43e5-aef4-61f8ea86aebe','Невероятно интересная задача',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('86f4888f-62a1-45e6-977e-cc8a8f37a4cc','33540dd5-c498-43e5-aef4-61f8ea86aebe','Очень важная задача',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('0158131f-8272-47db-a5a6-afc16f01de40','33540dd5-c498-43e5-aef4-61f8ea86aebe','Ещё одна тяжёлая задача',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('e6bc027e-09ab-4a74-a4d7-bd3a2c70fe29','33540dd5-c498-43e5-aef4-61f8ea86aebe','Очень увлекательная задача',false,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('142eb868-d771-4724-ade5-920153e9b8ac','33540dd5-c498-43e5-aef4-61f8ea86aebe','Срочная задача',false,5)
on conflict do nothing;
------------------------------------------------


insert into columns (column_id, project_id, column_name, column_position)
values ('fad55ed8-2f2a-4a34-9152-4c652c9c2531','c4188f60-018c-4038-8feb-3773e543bd8c','Шестая колонка',5)
on conflict do nothing;

--------------------------------------------------1
insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('36dbabef-9a1a-4335-abd8-6acae51bbcbc','fad55ed8-2f2a-4a34-9152-4c652c9c2531','Оранжевый список',0,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('b14f12f2-a629-47ca-b355-4d10b64135e2','36dbabef-9a1a-4335-abd8-6acae51bbcbc','Последняя оранжевая задача',false,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('673a4535-161d-4673-86e7-b13030131478','36dbabef-9a1a-4335-abd8-6acae51bbcbc','Очень интересная, а главное увлекательная оранжевая задача',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('ceea0de6-dcd6-40a7-a6c8-cd0e38fdd85f','36dbabef-9a1a-4335-abd8-6acae51bbcbc','Задача оранжевого цвета требующая особой точности',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('0f1f3129-14ae-4ebc-b4d1-5c25338c4bc6','36dbabef-9a1a-4335-abd8-6acae51bbcbc','Неотложная оранжевая задача',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('f0a0d5ce-071e-4f6d-86ab-128f7529283d','36dbabef-9a1a-4335-abd8-6acae51bbcbc','Давно забытая, но очень важная оранжевая задача',false,1)
on conflict do nothing;

-----------------------------------------------------2
insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('51ea9426-6b75-4693-8bea-0b459905fbda','fad55ed8-2f2a-4a34-9152-4c652c9c2531','Тоже простой список',1,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('9e36a44a-1df2-4342-8aa6-41208d137c9b','51ea9426-6b75-4693-8bea-0b459905fbda','Потом ещё это',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('7feeb8f7-36fd-4e78-af07-f86fc2e76bd0','51ea9426-6b75-4693-8bea-0b459905fbda','И это тоже придётся сделать',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('9a03de6d-8da4-46bd-9e15-d5f3c70c5191','51ea9426-6b75-4693-8bea-0b459905fbda','Ещё вот это',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('33e04f18-eec4-4555-90c2-43ec3d0d2188','51ea9426-6b75-4693-8bea-0b459905fbda','Не забыть про это',false,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('338f1ed8-daae-4d6f-9692-3e0c584bb4c3','51ea9426-6b75-4693-8bea-0b459905fbda','Ну и наконец это',false,6)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('65327462-8a2a-454c-90a1-9786ebea72d7','51ea9426-6b75-4693-8bea-0b459905fbda','Надо сделать это',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('d79555f8-d327-4336-a0cc-2ac279fd4303','51ea9426-6b75-4693-8bea-0b459905fbda','Ну и конечно же вот это',false,5)
on conflict do nothing;

--------------------------------------3
insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('391f02ff-46f1-43ed-a34a-26da071aa133','fad55ed8-2f2a-4a34-9152-4c652c9c2531','Розовый список',2,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('5d04f6de-d2df-4d86-9795-8ffe4d7dbb51','391f02ff-46f1-43ed-a34a-26da071aa133','Вторая розовая задача',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('57f2d040-a5d5-40b0-96a4-bdbb3354ba94','391f02ff-46f1-43ed-a34a-26da071aa133','Предпоследняя розовая задача',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('493bb1cb-e6fb-40ae-a51b-106955d51ca1','391f02ff-46f1-43ed-a34a-26da071aa133','Последняя розовая задача',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('1a939c48-4c5b-4bdb-847d-b6ac2d40f6b6','391f02ff-46f1-43ed-a34a-26da071aa133','Розовая задача номер один',false,0)
on conflict do nothing;
--------------------------------------


insert into columns (column_id, project_id, column_name, column_position)
values ('01df66f3-87e3-4a7a-aed9-385909f9ae5a','c4188f60-018c-4038-8feb-3773e543bd8c','Седьмая колонка',6)
on conflict do nothing;

------------------------------1
insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('e517e237-fa17-4250-a471-f2208d95ac27','01df66f3-87e3-4a7a-aed9-385909f9ae5a','Ещё один простой список',0,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('efb55bdd-3167-4969-a4e9-3b8021784474','e517e237-fa17-4250-a471-f2208d95ac27','Задача полегче',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('fa4f3172-5c6f-4ccc-bab1-9d6c23f520dd','e517e237-fa17-4250-a471-f2208d95ac27','Невероятно интересная задача',false,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('ab419b9e-8861-48e5-8254-c43b15cc3169','e517e237-fa17-4250-a471-f2208d95ac27','Трудная задача',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('f1a6903e-f737-4421-ae06-d0f4db9baf5d','e517e237-fa17-4250-a471-f2208d95ac27','Очень важная задача',false,7)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('a709babd-8228-46dd-af3c-a8a187c9b77c','e517e237-fa17-4250-a471-f2208d95ac27','Ещё одна тяжёлая задача',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('612bb1f9-7505-4a41-95e9-baf90454708f','e517e237-fa17-4250-a471-f2208d95ac27','Очень увлекательная задача',false,5)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('c042f3a8-3c90-4226-81f3-824166bf66ac','e517e237-fa17-4250-a471-f2208d95ac27','Задача на пару минут',false,6)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('d1564be7-9e9e-4153-8720-56aee48be186','e517e237-fa17-4250-a471-f2208d95ac27','Срочная задача',false,8)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('e0a2fb14-59b8-4108-a29b-2102a6205ecb','e517e237-fa17-4250-a471-f2208d95ac27','Простенькая задачка',false,2)
on conflict do nothing;

---------------------------------------2

insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('f60e1063-df08-4c11-a5fc-eec847a77e59','01df66f3-87e3-4a7a-aed9-385909f9ae5a','Синий список',1,7)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('caa2b81d-e1ed-43ca-8477-272441f04f7b','f60e1063-df08-4c11-a5fc-eec847a77e59','Ещё одна быстрая синяя задачка',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('15f0f378-582d-4658-909d-3001f8d59442','f60e1063-df08-4c11-a5fc-eec847a77e59','Тоже синяя задача не из лёгких',false,2)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('1257127e-8c4b-415f-a695-7d715d05fbb5','f60e1063-df08-4c11-a5fc-eec847a77e59','Непростая синяя задача',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('0b494f90-0006-49c5-a2b2-caa069619dac','f60e1063-df08-4c11-a5fc-eec847a77e59','Очень интересная синяя задача',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('b594b877-2621-410c-87bf-27f791f8965f','f60e1063-df08-4c11-a5fc-eec847a77e59','Срочная синяя задача',false,4)
on conflict do nothing;

---------------------------------------3
insert into task_lists (task_list_id, column_id, task_list_name, task_list_position, task_list_color)
values ('3eb639dc-1fe4-4628-b019-5b4d2d86325d','01df66f3-87e3-4a7a-aed9-385909f9ae5a','Фиолетовый список',2,8)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('62a4876a-ec06-491d-91db-992f8231f9ea','3eb639dc-1fe4-4628-b019-5b4d2d86325d','Последняя фиолетовая задача',false,5)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('edf4b0de-13aa-411b-a2d8-565732656fb9','3eb639dc-1fe4-4628-b019-5b4d2d86325d','Тоже фиолетовая   задача не из лёгких',false,3)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('f5d270d5-019a-4c1d-a6af-dc56a656bc29','3eb639dc-1fe4-4628-b019-5b4d2d86325d','Задача на пару минут фиолетового цвета',false,4)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('690aaa8e-4005-48da-86ca-3adbcd1afe5b','3eb639dc-1fe4-4628-b019-5b4d2d86325d','Первая фиолетовая задача',false,0)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('5126f569-397d-4b0c-a1bd-93ebf19e0142','3eb639dc-1fe4-4628-b019-5b4d2d86325d','Фиолетовая задача номер два',false,1)
on conflict do nothing;

insert into tasks (task_id, task_list_id, task_name, task_state, task_position)
values ('41147913-c1a6-4d24-be53-51fe5b39e351','3eb639dc-1fe4-4628-b019-5b4d2d86325d','Невероятно интересная фиолетовая задача',false,2)
on conflict do nothing;














