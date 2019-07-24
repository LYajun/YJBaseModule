#
# Be sure to run `pod lib lint YJBaseModule.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'YJBaseModule'
  s.version          = '1.0.0'
  s.summary          = '基类'

  s.description      = <<-DESC
TODO: Add long description of the pod here.
                       DESC

  s.homepage         = 'https://github.com/LYajun/YJBaseModule'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'LYajun' => 'liuyajun1999@icloud.com' }
  s.source           = { :git => 'https://github.com/LYajun/YJBaseModule.git', :tag => s.version.to_s }

  s.ios.deployment_target = '8.0'

  s.source_files = 'YJBaseModule/Classes/YJBaseModule.h'
  s.resources = 'YJBaseModule/Classes/YJBaseModule.bundle'

s.subspec 'Manager' do |manager|
    manager.source_files = 'YJBaseModule/Classes/Manager/**/*'
end

s.subspec 'UIKit' do |uikit|
    uikit.source_files = 'YJBaseModule/Classes/UIKit/**/*'
end

  # s.public_header_files = 'Pod/Classes/**/*.h'
  # s.frameworks = 'UIKit', 'MapKit'
  # s.dependency 'AFNetworking', '~> 2.3'
end
