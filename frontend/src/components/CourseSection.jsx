import React from 'react';
import { ArrowRight } from 'lucide-react';

const courses = [
  {
    title: 'Introduction to Robotics',
    description: 'Perfect for beginners. Learn the basics of robotics and programming.',
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
    level: 'Beginner',
    duration: '8 weeks',
  },
  {
    title: 'Advanced Programming',
    description: 'Deep dive into complex programming concepts and robotics control.',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
    level: 'Advanced',
    duration: '12 weeks',
  },
  {
    title: 'AI & Machine Learning',
    description: 'Explore the intersection of robotics and artificial intelligence.',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
    level: 'Intermediate',
    duration: '10 weeks',
  },
];

const CourseSection = () => {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Courses</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Choose from our selection of specialized courses designed for all skill levels
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {courses.map((course) => (
            <article key={course.title} className="flex flex-col items-start">
              <div className="relative w-full">
                <img
                  src={course.image}
                  alt={course.title}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime="2020-03-16" className="text-gray-500">
                    {course.duration}
                  </time>
                  <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                    {course.level}
                  </span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <span className="absolute inset-0" />
                    {course.title}
                  </h3>
                  <p className="mt-5 text-sm leading-6 text-gray-600">{course.description}</p>
                </div>
                <div className="mt-8">
                  <a href="#" className="text-blue-600 hover:text-blue-500 inline-flex items-center text-sm font-semibold">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSection;