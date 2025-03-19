DROP VIEW IF EXISTS public.vw_shift_summary;

CREATE OR REPLACE VIEW public.vw_shift_summary AS
SELECT row_number() OVER ()                                              AS id, -- Уникальный идентификатор строки
       s.start_time                                                      AS start_time,
       s.end_time                                                        AS finish_time,
       EXTRACT(epoch FROM COALESCE(s.end_time, now()) - s.start_time)    AS shift_duration_seconds,
       t.gos_num                                                         AS tech_gos_number,
       tt.name                                                           AS tech_type,
       ts.name                                                           AS tech_status,
       dorg.name                                                         AS org,
       se.id                                                             AS event_id,
       e.name                                                            AS event_name,
       se.confirmation                                                   AS event_confirmation,
       se.start_time                                                     AS event_start_time,
       se.end_time                                                       AS event_finish_time,

       EXTRACT(epoch FROM COALESCE(se.end_time, now()) - se.start_time)  AS event_duration_seconds,
       string_agg((dp.name::text || ': '::text) || de.value, ', '::text) AS equipment_details
FROM registry_shifts s
         LEFT JOIN (SELECT registry_shiftevent.id,
                           registry_shiftevent.shift_id,
                           registry_shiftevent.event_id,
                           registry_shiftevent.start_time,
                           registry_shiftevent.end_time,
                           registry_shiftevent.confirmation,
                           row_number()
                           OVER (PARTITION BY registry_shiftevent.shift_id ORDER BY registry_shiftevent.start_time DESC) AS row_num
                    FROM registry_shiftevent) se ON s.id = se.shift_id AND se.row_num = 1
         LEFT JOIN dict_event e ON se.event_id = e.id
         LEFT JOIN registry_tech t ON s.tech_id = t.id
         LEFT JOIN dict_techtype tt ON t.type_id = tt.id
         LEFT JOIN dict_techstatus ts ON t.status_id = ts.id
         LEFT JOIN registry_tech_equipment rte ON t.id = rte.tech_id
         LEFT JOIN registry_equipment re ON rte.equipment_id = re.id
         LEFT JOIN registry_equipment_parameters rep ON rep.equipment_id = re.id
         LEFT JOIN dict_equipmentparameters de ON rep.equipmentparameters_id = de.id
         LEFT JOIN dict_parameters dp ON de.parameters_id = dp.id
         LEFT JOIN dict_org dorg ON t.org_id = dorg.id
GROUP BY s.start_time, s.end_time, t.gos_num, tt.name, ts.name, dorg.name, se.id, e.name, se.confirmation,
         se.start_time, se.end_time;
