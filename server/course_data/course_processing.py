import pandas as pd
import numpy as np

def processDF(raw_csv_name, new_csv_name):
    raw_df = pd.read_csv(raw_csv_name)
    print(raw_df)
    new_df = convertCourseDF(raw_df)
    print(new_df)
    new_df.to_csv(new_csv_name)

def convertCourseDF(df):
    rows, cols = df.shape
    title_dict = {}
    num_students_dict = {}
    gpa_points_dict = {}
    for i in range(0, rows):
        course_id = df.iloc[i]['Subject'] + " " + str(df.iloc[i]['Course '])
        start_col = df.columns.get_loc("A+")
        num_students = np.sum(df.iloc[i][start_col:start_col+13].values)
        avg_gpa = df.iloc[i]["Average Grade"]
        
        if course_id in num_students_dict:
            num_students_dict[course_id] = num_students_dict[course_id] + num_students
            gpa_points_dict[course_id] = gpa_points_dict[course_id] + (num_students * avg_gpa)
        else:
            num_students_dict[course_id] = num_students
            gpa_points_dict[course_id] = num_students * avg_gpa
        title_dict[course_id] = df.iloc[i]['Course Title']

    data = []
    for key in title_dict:
        subject, course = key.split(' ')
        title = title_dict[key]
        num_students = num_students_dict[key]
        avg_gpa = round(gpa_points_dict[key] / num_students, 2)
        data.append([subject, course, title, num_students, avg_gpa])
    return pd.DataFrame(data, columns=['Department', 'CourseNumber', 'CourseName', 'StudentCount', 'AvgGPA'])

processDF("./raw_data/sp2019_raw.csv", "sp2019.csv")