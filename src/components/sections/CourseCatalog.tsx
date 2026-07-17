'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Clock, Users, Star, Filter, Search, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { courses } from '@/lib/data';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { Course } from '@/types';

const CourseCatalog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showAll, setShowAll] = useState<boolean>(false);

  const categories = [
    { id: 'all', name: 'Todos los Cursos' },
    { id: 'Bombas y Turbomáquinas', name: 'Bombas y Turbomáquinas' },
    { id: 'CFD y Simulación Industrial', name: 'CFD y Simulación' },
    { id: 'Diseño Mecánico y Simulación Estructural', name: 'Diseño Mecánico' },
    { id: 'Fundamentos de Ingeniería', name: 'Fundamentos' },
  ];

  const levels = [
    { id: 'all', name: 'Todos los Niveles' },
    { id: 'Básico', name: 'Básico' },
    { id: 'Intermedio', name: 'Intermedio' },
    { id: 'Avanzado', name: 'Avanzado' },
  ];

  const filteredCourses = useMemo(() => {
    let filtered = courses.filter((course) => {
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesLevel && matchesSearch;
    });

    // Show only first 8 courses unless "show all" is enabled
    if (!showAll) {
      filtered = filtered.slice(0, 8);
    }

    return filtered;
  }, [selectedCategory, selectedLevel, searchTerm, showAll]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">
            <Filter className="w-4 h-4 mr-2" />
            Catálogo de Cursos
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {formatNumber(courses.length)} cursos especializados
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desde fundamentos hasta técnicas avanzadas, nuestro catálogo cubre todas las áreas críticas de la ingeniería moderna
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Level Filter */}
          <div className="flex justify-center">
            <div className="flex gap-2">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedLevel === level.id
                      ? 'bg-secondary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-secondary-50 hover:text-secondary-600 border border-gray-200'
                  }`}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Show More/Less Button */}
        {courses.length > 8 && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              size="lg"
            >
              {showAll ? 'Ver Menos' : `Ver Todos los ${formatNumber(courses.length)} Cursos`}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const discountPercentage = course.originalPrice
    ? Math.round((1 - (typeof course.price === 'number' ? course.price : parseFloat(course.price)) / course.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Course Image */}
      <div className="aspect-video bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {course.isPopular && (
            <span className="px-2 py-1 bg-yellow-500 text-white rounded text-xs font-medium">
              Popular
            </span>
          )}
          {course.isFeatured && (
            <span className="px-2 py-1 bg-green-500 text-white rounded text-xs font-medium">
              Destacado
            </span>
          )}
          <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
            course.level === 'Básico' ? 'bg-green-600' :
            course.level === 'Intermedio' ? 'bg-yellow-600' : 'bg-red-600'
          }`}>
            {course.level}
          </span>
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium">
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* Course Category Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <span className="text-2xl text-white font-bold">
              {course.category === 'Bombas y Turbomáquinas' ? '⚙️' :
               course.category === 'CFD y Simulación Industrial' ? '🌊' :
               course.category === 'Diseño Mecánico y Simulación Estructural' ? '🔧' : '📚'}
            </span>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6 space-y-4">
        {/* Course Title */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {course.shortDescription}
          </p>
        </div>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{formatNumber(course.studentsCount || 0)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>{course.rating}</span>
          </div>
        </div>

        {/* Instructor */}
        <div className="text-sm text-gray-600">
          <span className="font-medium">Instructor:</span> {course.instructor}
        </div>

        {/* Pricing and CTA */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(typeof course.price === 'number' ? course.price : parseFloat(course.price))}
                </span>
                {course.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(course.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link href={`/cursos/${course.id}`}>
            <Button
              variant="outline"
              className="w-full group-hover:bg-primary-50 group-hover:border-primary-300 group-hover:text-primary-700"
            >
              <span>Ver Curso</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;