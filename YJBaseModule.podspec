#
# Be sure to run `pod lib lint YJBaseModule.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'YJBaseModule'
  s.version          = '1.2.9'
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
    manager.dependency 'YJExtensions'
    manager.dependency 'LGBundle/Bundle'
end

s.subspec 'MarqueeLabel' do |marqueeLabel|
    marqueeLabel.source_files = 'YJBaseModule/Classes/MarqueeLabel/**/*'
end

s.subspec 'YJBHpple' do |hpple|
    hpple.source_files = 'YJBaseModule/Classes/YJBHpple/**/*'
    hpple.libraries  = 'xml2'
    hpple.xcconfig  =  {'HEADER_SEARCH_PATHS' => '$(SDKROOT)/usr/include/libxml2'}
end

s.subspec 'YJBWebView' do |webView|
    webView.source_files = 'YJBaseModule/Classes/YJBWebView/**/*'
     webView.dependency 'YJBaseModule/MarqueeLabel'
    webView.dependency 'YJBaseModule/YJBHpple'
    webView.dependency 'YJBaseModule/Manager'
    webView.dependency 'Masonry'
    webView.dependency 'YJExtensions'
end

s.subspec 'Base' do |base|
    base.source_files = 'YJBaseModule/Classes/Base/**/*'
    base.dependency 'YJBaseModule/Manager'
    base.dependency 'MJRefresh'
    base.dependency 'Masonry'
    base.dependency 'MJExtension'
    base.dependency 'YJExtensions'
    base.dependency 'LGAlertHUD'
    base.dependency 'YJActivityIndicatorView'
end



  # s.public_header_files = 'Pod/Classes/**/*.h'
  # s.frameworks = 'UIKit', 'MapKit'
  # s.dependency 'AFNetworking', '~> 2.3'
end
