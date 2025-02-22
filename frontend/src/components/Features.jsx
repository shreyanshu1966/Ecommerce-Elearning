import React from 'react';
import { Code, Notebook as Robot, Lightbulb, Users } from 'lucide-react';

const features = [
  {
    name: 'Robotics Education',
    description: 'Hands-on learning with state-of-the-art robotics kits and equipment.',
    icon: Robot,
  },
  {
    name: 'Coding Programs',
    description: 'Learn programming fundamentals through interactive projects and challenges.',
    icon: Code,
  },
  {
    name: 'Innovation Labs',
    description: 'Access to modern facilities equipped with the latest technology.',
    icon: Lightbulb,
  },
  {
    name: 'Expert Instructors',
    description: 'Learn from experienced professionals in robotics and programming.',
    icon: Users,
  },
];

const Features = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Why Choose Us</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to excel in robotics
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our comprehensive programs combine hands-on learning with theoretical knowledge to create well-rounded tech enthusiasts.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;