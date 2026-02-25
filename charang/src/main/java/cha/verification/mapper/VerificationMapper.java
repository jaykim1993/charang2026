package cha.verification.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface VerificationMapper {

    void saveCode(@Param("email") String email,
                  @Param("code") String code);

    int verifyCode(@Param("email") String email,
                   @Param("code") String code);

    void deleteCode(@Param("email") String email);
}